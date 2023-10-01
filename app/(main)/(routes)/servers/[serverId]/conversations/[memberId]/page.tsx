import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { profile } from "console";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const ConversationPage = async ({ params }: MemberIdPageProps) => {
  console.log(params.memberId);

  const member = await db.member.findUnique({
    where: {
      id: params.memberId,
    },
    include: {
      profile: true,
    },
  });

  if (!member) {
    return redirect("/");
  }

  return (
    <div>
      <ChatHeader
        serverId={params.serverId}
        name={member.profile.name}
        type="conversation"
        imageUrl={member.profile.imageUrl}
      />
    </div>
  );
};

export default ConversationPage;
