import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { profile } from "console";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { getOrCreateConversation } from "@/lib/conversation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const ConversationPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findUnique({
    where: {
      id: params.memberId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return (
      <div className=" font-semibold h-full flex items-center justify-center">
        <p>Cannot find the conversation or create the conversation</p>
      </div>
    );
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.id === currentMember.id ? memberOne.id : memberTwo.id;

  return (
    <div className="h-full">
      {/* conversation body */}
      <div className="h-full flex flex-col">hello</div>
    </div>
  );
};

export default ConversationPage;
