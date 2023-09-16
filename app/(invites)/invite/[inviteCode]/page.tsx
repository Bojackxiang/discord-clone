import React from "react";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodeProps) => {
  const { inviteCode } = params;
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const serverWithInvitedCode = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
    },
  });

  if (!serverWithInvitedCode) {
    return "No such Invited code";
  }

  // check if user already in the server
  const existedInServer = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: serverWithInvitedCode.id,
    },
  });

  if (existedInServer) {
    return redirect(`/servers/${serverWithInvitedCode.id}`);
  } else {
    await db.member.create({
      data: {
        serverId: serverWithInvitedCode.id,
        profileId: profile.id,
      },
    });
  }

  return <div>Invite page</div>;
};

export default InviteCodePage;
