import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim()) || [];
      if (!adminEmails.includes(req.nextauth.token?.email || '')) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
}; 