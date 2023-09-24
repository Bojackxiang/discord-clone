"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import { Hash, Video, Mic, Edit, Lock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../ActionToolTop";
import { modalType, useModal } from "@/hooks/use-modal";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role: string;
}

const ICON_MAP = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = ICON_MAP[channel.type];

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: modalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <React.Fragment>
      <button
        onClick={onClick}
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
      >
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              {/* TODO: UPDATE THE EDIT CHANNEL */}
              <Edit
                onClick={(e) => onAction(e, "EDIT_CHANNEL")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              {/* TODO: CHANGE THE DELETE */}
              <Trash
                onClick={(e) => onAction(e, "DELETE_CHANNEL")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </React.Fragment>
  );
};
