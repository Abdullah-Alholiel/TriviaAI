'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AuthDialog } from './AuthDialog'
import { Button } from '@/components/ui/button'
import ShinyButton from '@/components/ui/shiny-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle } from 'lucide-react'

export function AuthButton() {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!session) {
    return (
      <>
        <ShinyButton
          onClick={() => setIsDialogOpen(true)}
          className="relative z-50 text-blue-500 border-blue-500 dark:text-blue-300 dark:border-blue-300"
        >
          Sign In
        </ShinyButton>
        <AuthDialog 
          isOpen={isDialogOpen} 
          onCloseAction={() => setIsDialogOpen(false)} 
        />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={session.user?.image ?? undefined} />
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          {session.user?.name || session.user?.email}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}