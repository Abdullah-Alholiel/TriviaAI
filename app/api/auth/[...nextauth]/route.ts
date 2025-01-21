import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github" 
import CredentialsProvider from "next-auth/providers/credentials"
import { UserType, SessionType, JWTType } from "@/types/database"

declare module "next-auth" {
  interface Session extends SessionType {}
  interface User extends UserType {}
  interface JWT extends JWTType {}
}

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "456496876714-40e0olugiae3k0fls93b7p2nkna4h8ou.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "Ov23li7xCzvtRiK0yDSa",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "d72e9aedcaf18ef2062b06a27d4fc56d20f2aa9b",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`/api/auth/check-credentials`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })

          const user = await res.json()

          if (res.ok && user) {
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              role: user.role,
              username: user.username,
              is_active: user.is_active,
              created_at: user.created_at
            }
          }
          return null
        } catch (error) {
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/users/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              username: profile?.name || user.email?.split('@')[0],
              oauth_provider: account.provider,
              oauth_id: account.providerAccountId,
            }),
          });
          const data = await res.json();
          if (data.success) {
            user.id = data.user.id;
            user.role = data.user.role;
          }
        } catch (error) {
          console.error('OAuth user creation failed:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id.toString();
        token.role = user.role;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }): Promise<SessionType> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ,
          role: token.role ,
          provider: token.provider,
        },
      };
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  events: {
    async signIn(message) {
      console.log('User signed in:', message)
    },
    async signOut(message) {
      console.log('User signed out:', message)
    },
    async error(message) {
      console.error('Error:', message)
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };