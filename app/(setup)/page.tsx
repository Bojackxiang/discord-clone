import InitialModal from "@/components/modals/InitialModal";
import { db } from "@/lib/db";
import { initProfile } from "@/lib/init-profile";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

// root page
const SetupPage = async () => {
  const profile = await initProfile();

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
    hello
    {/* <UserButton/> */}
    <InitialModal/>
  </div>;
};

export default SetupPage;
