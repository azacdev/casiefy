/**
 * Routes that are accessible to the public
 * They dont require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/new-verification",
  "/case/design",
  "/case/upload",
  "/case/preview",
  "/api/auth/providers",
];

/**
 * Routes used for authentication
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/signup",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * Prefix for api authentication routes
 * Routes that start with prefix are used for authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Api routes
 * These routes are for api purpose
 * @type {string}
 */
export const apiRoutes = ["/api/uploadthing"];

/**
 * The default redirect path after logging in
 * @type {string}
 * **/
export const DEFAULT_LOGIN_REDIRECT = "/";
