"use server";

import getSession from "@/lib/get-session";

export const getAuthStatus = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user?.id || !user?.email) {
    throw new Error("Invalid user data");
  }

  return { success: true };
};
