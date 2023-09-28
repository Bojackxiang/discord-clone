
import React from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

interface ServerIdProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdProps) => {
  const profile = await currentProfile();
  console.log('profile: ', profile);
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  const generalChannel = server?.channels[0];``
  console.log('generalChannel: ', generalChannel);

  if(generalChannel?.name !== 'general'){
    return null;
  }

  const redirectUrl = `/servers/${params.serverId}/channels/${generalChannel.id}` 
  console.log('redirectUrl: ', redirectUrl);

  return redirect(redirectUrl);
};

export default ServerIdPage;
