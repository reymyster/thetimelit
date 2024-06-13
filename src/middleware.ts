import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/manage(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  // auth().protect((has) => {
  //   const hasOrgAdmin = has({ role: "org:admin" });
  //   console.log({ hasOrgAdmin });
  //   return hasOrgAdmin;
  // });
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
