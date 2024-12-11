'use client'

import { useSession } from 'next-auth/react'
import { LoginButton } from './ClientComponents/login-button'
import { UserMenu } from './ClientComponents/user-menu'
import { RoomActions } from './ClientComponents/room-actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13111C] to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-800 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-pink-500" />
            Alpha Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            {session ? (
              <>
                     <div className='w-full '>
                  <UserMenu userName={session.user?.name || 'User'} />
                      
                      
                      </div>         
                  <Link href="/admin">
                    <Button 
                      variant="outline" 
                      className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
             
 
                <RoomActions userEmail={session.user?.email || ''} />
              </>
            ) : (
              <div className="text-center">
          
                <LoginButton />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

