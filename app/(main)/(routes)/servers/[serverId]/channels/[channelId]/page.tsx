import React from "react";
import { redirect, useRouter } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async (props: ChannelIdPageProps) => {
  const { params } = props;
  console.log(params.channelId);

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
    <div className="h-full bg-white dark:bg-[#313338] flex flex-col">
      <ChatHeader
        name={channel?.name || ""}
        serverId={params.serverId || ""}
        type="channel"
      />
      <div className="flex flex-1 flex-col">
        <ChatMessages
          member={member}
          name={channel?.name}
          chatId={channel?.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel?.id,
            serverId: channel?.serverId,
          }}
          paramKey="channelId"
          paramValue={channel?.id}
        />
      </div>
      <div>
        <ChatInput
          name={channel?.name || ""}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel?.id || "",
            serverId: channel?.serverId || "",
          }}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
