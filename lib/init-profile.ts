import { currentUser, RedirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import { User } from "@clerk/nextjs/server";


export async function initProfile(user: User) {
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
