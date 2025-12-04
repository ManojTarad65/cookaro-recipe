export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         * - register (register page)
         * - about (about page)
         * - contact (contact page)
         * - $ (homepage)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|about|contact|$).*)",
    ],
};
