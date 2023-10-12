"use client";

import React, { Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useQueryChat } from "@/hooks/use-query-hook";
import { Loader2 } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string | null | undefined;
  member:
    | (Member & {
        profile: Profile;
      })
    | null
    | undefined;
  chatId: string | undefined;
  apiUrl: string;
  socketUrl: string | undefined;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string | undefined;
  type: "channel" | "conversation";
}

const ChatMessages = (props: ChatMessagesProps) => {
  const queryKey = `chat:${props.chatId}`;
  const addKey = `chat:${props.chatId}:messages`;
  const updateKey = `chat:${props.chatId}:messages:update`;

  
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryChat({
      queryKey,
      apiUrl: props.apiUrl,
      paramKey: props.paramKey,
      paramValue: props.paramValue,
    });
    console.log(addKey)
    useChatSocket({queryKey, addKey, updateKey});

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
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((message: MessageWithMemberAndProfile) => {
                return (
                  <div key={message.id}>
                    <ChatItem
                      key={message.id}
                      id={message.id}
                      member={message.member}
                      currentMember={props.member}
                      content={message.content}
                      fileUrl={message.fileUrl}
                      deleted={message.deleted}
                      timestamp={format(
                        new Date(message.createdAt),
                        DATE_FORMAT
                      )}
                      isUpdated={message.updatedAt !== message.createdAt}
                      
                      socketUrl={props.socketUrl}
                      socketQuery={props.socketQuery}
                    />
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
