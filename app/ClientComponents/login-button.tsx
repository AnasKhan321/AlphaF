import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { ChromeIcon as Google } from 'lucide-react'

export function LoginButton() {
  return (
    <Button 
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 border border-gray-300 shadow-sm flex items-center justify-center space-x-2"
    >
      <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt=""  className="h-[30px]  w-[30px]"/>
      <span>Continue with Google</span>
    </Button>
  )
}

