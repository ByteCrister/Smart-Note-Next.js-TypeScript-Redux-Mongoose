import { NextRequest, NextResponse } from "next/server";
import decodeToken from "./services/helper/server/DecodeToken";

export async function middleware(req: NextRequest) {
  const tokenKey = process.env.NEXT_TOKEN as string;
  const token = req.cookies.get(tokenKey)?.value;

  // console.log("NEXT_TOKEN: ", tokenKey);
  // console.log("Token: " + token);
  // console.log("Request cookies: ", req.cookies.getAll());

  // Check if the request is for the /user-auth route
  const isAuthRoute = req.nextUrl.pathname === "/user-auth";
  console.log(req.nextUrl.pathname);

  if (token) {
    try {
      // Verify the token
      console.log("isAuthRoute: " + isAuthRoute);
      const decoded = await decodeToken(token);
      console.log("decoded: " + decoded);
      // If the token is valid and the user tries to access /user-auth, redirect them to the home page
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to / 
      }

      // Token is valid, allow the request to continue
      return NextResponse.next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      // If the token is invalid or expired, do not clear the cookie, just redirect to /user-auth
      return NextResponse.redirect(new URL("/user-auth", req.url));
    }
  }

  // If no token and the user tries to access a protected route (except /user-auth), redirect to /user-auth
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/user-auth", req.url));
  }

  // Allow unauthenticated users to access /user-auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path"],
};