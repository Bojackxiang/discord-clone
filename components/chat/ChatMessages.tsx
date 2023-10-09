"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useQueryChat } from "@/hooks/use-query-hook";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  name: string | null | undefined;
  member: Member | null | undefined;
  chatId: string | undefined;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string | undefined>;
  paramKey: "channelId" | "conversationId";
  paramValue: string | undefined;
  type: "channel" | "conversation";
}

const ChatMessages = (props: ChatMessagesProps) => {
  const queryKey = `chat:${props.chatId}`;

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryChat({
      queryKey,
      apiUrl: props.apiUrl,
      paramKey: props.paramKey,
      paramValue: props.paramValue,
    });

  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={props.type} name={props.name} />
    </div>
  );
};

export default ChatMessages;
