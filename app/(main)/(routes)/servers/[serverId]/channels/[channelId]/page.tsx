import React from "react";
import { redirect, useRouter } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/ChatHeader";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async (props: ChannelIdPageProps) => {
  const { params } = props;
  console.log(params.channelId)

  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });


  // if (!channel) {
  //   // return redirect("/");
  // }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full"'>
      <ChatHeader
        name={channel?.name || ''}
        serverId={params.serverId || ''}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
