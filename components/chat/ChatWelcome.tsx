"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  type: string | undefined | null;
  name: string | undefined | null;
}

const ChatWelcome = (params: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {params.type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {params.type === "channel" ? "Welcome to #" : ""}
        {params.name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {params.type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${params.name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
