import NextAuth, { Account, Profile, User } from "next-auth"
import Google from "next-auth/providers/google"
import { AdapterUser } from "next-auth/adapters"
import axios from "axios"

export const BASE_URL = "https://d9ay5rmqf0duw.cloudfront.net"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  callbacks: {
    async signIn({ user, account, profile }  : 
        {
            user: User | AdapterUser;
            account: Account | null;
            profile?: Profile | null;
          }) {
      const response = await axios.get(`${BASE_URL}/api/auth/user/${user.email}`)
      if(response.data.success){
        return true ; 
      }
      const data = await axios.post(`${BASE_URL}/api/auth/signup`  , {
        name : user.name , 
        email : user.email ,
        imageurl : user.image 

      } ) 
      return true
    },
    async redirect({ url, baseUrl }) {
      // Control redirect behavior
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session({ session, user, token }) {
      // Customize session data here
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
})