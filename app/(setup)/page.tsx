import InitialModal from "@/components/modals/InitialModal";
import { db } from "@/lib/db";
import { initProfile } from "@/lib/init-profile";
import { RedirectToSignIn, UserButton, currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import React from "react";

// root page
const SetupPage = async () => {
  const user = await currentUser();
  if(!user){
    return <RedirectToSignIn/>
  }
  
  const profile = await initProfile(user);

  if (profile) {
    const foundServer = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (foundServer) {
      return redirect(`/servers/${foundServer.id}`);
    }
  }

  return <div>
    <UserButton/>
    <InitialModal/>
  </div>;
};

export default SetupPage;
