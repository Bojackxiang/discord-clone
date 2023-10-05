import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest) => {
  try {
    const { userId } = getAuth(req);

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
