"use client";
import React from "react";
import { redirect, useParams, useRouter } from "next/navigation";
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

  const existInServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existInServer) {
    return redirect(`/servers/${existInServer.id}`);
  }

  await db.server.update({
    where: { inviteCode: inviteCode },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  return <div>{inviteCode}</div>;
};

export default InviteCodePage;
