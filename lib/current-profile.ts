import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const profile = await db.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    return profile;
  } catch (error: any) {
    throw new Error("lib::currentUser::", error.message);
  }
};
