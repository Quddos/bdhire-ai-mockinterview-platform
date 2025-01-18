import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";



const isProtectedRoute = createRouteMatcher([
    
    '/dashboard(.*)',
    '/forum(.*)',
    '/tools(.*)',
    '/about(.*)',
    '/sponsor(.*)',
    '/login(.*)',
  ]);

  export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
  });

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};