import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./ServerHeader";
import { ServerSearch } from "./ServerSearch";
import { ServerSection } from "./ServerSection";
import { ServerChannel } from "./ServerChannel";
import { ServerMember } from "./ServerMember";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    console.debug('!!!Redirected!!!')
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!role) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "text channels",
                type: "channel",
                data: textChannels?.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    name: channel.name,
                    id: channel.id,
                  };
                }),
              },
              {
                label: "Audio channels",
                type: "channel",
                data: audioChannels?.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    name: channel.name,
                    id: channel.id,
                  };
                }),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    name: channel.name,
                    id: channel.id,
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => {
                  return {
                    icon: roleIconMap[member.role],
                    name: member.profile.name,
                    id: member.id,
                  };
                }),
              },
            ]}
          />
        </div>

        {/* block-1-start: text channel*/}
        <>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channel"
                channelType={ChannelType.TEXT}
                role={role}
                label="text channels"
                server={server}
              />
              <div className="space-y-2">
                {textChannels.map((channel) => {
                  return (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      server={server}
                      role={role}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>

        {/* block-3-start: audio channel */}
        <>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channel"
                channelType={ChannelType.AUDIO}
                role={role}
                label="Audio channels"
                server={server}
              />
              <div className="space-y-2">
                {audioChannels.map((channel) => {
                  return (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      server={server}
                      role={role}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>

        {/* block-4-start: video channel */}
        <>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channel"
                channelType={ChannelType.VIDEO}
                role={role}
                label="Video channels"
                server={server}
              />
              <div className="space-y-2">
                {videoChannels.map((channel) => {
                  return (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      server={server}
                      role={role}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>

        {/* block-5-start: members */}
        <>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="channel"
                channelType={ChannelType.TEXT}
                role={role}
                label="members"
              />
              <div className="space-y-2">
                {members.map((member) => {
                  return (
                    <ServerMember
                      server={server}
                      member={member}
                      key={member.id}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      </ScrollArea>
    </div>
  );
};
