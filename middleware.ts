import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
   // redirecting from home/landing page to select-org or dashboard based on the auth status
   // console.log(isPublicRoute(req));
   if (isPublicRoute(req) && auth().userId) {
      let path = "/select-org";

      if (auth().orgId) {
         // if user also has an organization
         path = `/organization/${auth().orgId}`;
      }

      const redirectPath = new URL(path, req.url);
      return NextResponse.redirect(redirectPath);
   }

   if (!auth().userId && !isPublicRoute(req)) {
      return auth().redirectToSignIn({ returnBackUrl: req.url });
   }

   // if user is signed in but no organization is selected
   if (
      auth().userId &&
      !auth().orgId &&
      req.nextUrl.pathname !== "/select-org"
   ) {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
   }
});

export const config = {
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
