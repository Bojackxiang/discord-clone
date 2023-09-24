"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { ActionTooltip } from "../ActionToolTop";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channel" | "member";
  channelType: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = (props: ServerSectionProps) => {
  const { label, role, sectionType, channelType, server } = props;
  const { onOpen } = useModal();

  const onChannelModalOpen = () => {
    onOpen("CREATE_CHANNEL", { server });
  };

  const onMEMBERModalOpen = () => {
    onOpen("MEMBER_MANAGEMENT", { server });
  };

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {/* guest-channel-1*/}
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={onChannelModalOpen}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {/* guest-channel-2*/}
      {role !== MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Create channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={onMEMBERModalOpen}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
