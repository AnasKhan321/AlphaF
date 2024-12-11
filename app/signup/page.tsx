"use client"
import { signIn } from "next-auth/react"

 
export default function Page() {
  

  return (


      

      <button type="submit" onClick={()=>{signIn("google")}}>Signin with Google</button>

  )
} 