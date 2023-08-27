import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function initProfile() {

  // check auth
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn({
      returnBackUrl: process.env.ROOT_URL,
    });
  }

  // find profile
  const profile = await db.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  // create profile
  const emailAddresses = user.emailAddresses;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.username} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
}
