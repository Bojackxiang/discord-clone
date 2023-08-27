import { authMiddleware } from "@clerk/nextjs";
 

// public routes  
export default authMiddleware({
  publicRoutes: ["/"],
  debug: false,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 