import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

const protectedRoutes  : string[] = []



export default auth((req   : any ) => {
  const isLoggedIn = !!req.auth
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  console.log(isProtectedRoute)


  if (isProtectedRoute && !isLoggedIn) {
    console.log(new URL("/", req.url))


    return NextResponse.redirect(new URL("/", req.url))
  }






  return NextResponse.next()
})

// This line configures which routes the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}