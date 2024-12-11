"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { UserCircle } from 'lucide-react'
import {useSession}  from "next-auth/react"

interface UserMenuProps {
  userName: string
}

export function UserMenu({ userName }: UserMenuProps) {

  const {data : session}  = useSession() ; 
  return (
    <div className="flex items-center justify-between bg-purple-100 p-4 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        {session && 
        <img src={session.user?.image  as string} alt=""  className="w-[40px]  h-[40px]  rounded-full "/>}
        <span className="font-semibold text-purple-800">{userName}</span>
      </div>
      <Button 
        onClick={() => signOut()}
        variant="outline"
        className="text-pink-600 border-pink-400 hover:bg-pink-100"
      >
        Sign Out
      </Button>
    </div>
  )
}

