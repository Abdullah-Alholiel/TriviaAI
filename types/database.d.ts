export interface UserType {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  oauth_provider?: string;
  oauth_id?: string;
}

export interface SessionType {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    provider?: string;
    image?: string | null;
  };
  expires: string;
}

export interface JWTType {
  id: string;
  role: string;
  provider?: string;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}