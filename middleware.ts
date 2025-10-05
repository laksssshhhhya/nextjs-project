import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(){
    return NextResponse.next();
  },
  {
    callbacks:{
      authorized({req, token}){
        const { pathname } = req.nextUrl;

        if(
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register")
        ){
          return true;
        }

        if(pathname === "/" || pathname.startsWith("/api/videos")){
          return true;
        }

        return !!token;
      },
    }
  }
)

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * _static (static files)
        * - favicon.ico (favicon file)
        * - public (public folder)
        */
       "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ]
}