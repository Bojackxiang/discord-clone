"use client";
import * as z from "zod";

import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import React, { memo, useEffect, useState } from "react";

import { ActionTooltip } from "../ActionToolTop";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal";
import UserAvatar from "../UserAvatar";

interface ChatItemProps {
  id: string;
  content: string;
  member:
    | (Member & {
        profile: Profile;
      })
    | null
    | undefined;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member | undefined | null;
  isUpdated: boolean;
  socketUrl: string | undefined;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = (props: ChatItemProps) => {
  // checker
  if (!props.member || !props.currentMember) {
    return <div>error happens</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const isAdmin = props.currentMember.role === MemberRole.ADMIN;
  const isModerator = props.currentMember.role === MemberRole.MODERATOR;
  const isOwner = props.currentMember.id === props.member.id;
  const canDeleteMessage =
    !props.deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !props.deleted && isOwner && !props.fileUrl;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      console.log(props.socketUrl);
      console.log(props.id);
      const url = qs.stringifyUrl({
        url: `${props.socketUrl}/${props.id}`,
        query: props.socketQuery,
      });
      const resp = await axios.patch(url, value);
      setIsEditing(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: props.content,
    },
  });

  const isLoading = false;

  const onMemberClick = () => {};

  useEffect(() => {
    form.reset({
      content: props.content,
    });
  }, [props.content]);

  useEffect(() => {
    const escapeKeyHandler = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", escapeKeyHandler);

    return () => {
      return window.removeEventListener("keydown", escapeKeyHandler);
    };
  }, []);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {/* avatar */}
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={props?.member.profile.imageUrl} />
        </div>

        {/* Action tool tip */}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {props.member.profile.name}
              </p>
              <ActionTooltip label={props.member.role}>
                {roleIconMap[props.member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {props.timestamp}
            </span>
          </div>

          {/* editing form */}
          {isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Edited message"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Button size="sm" variant="primary">
                  Save
                </Button>
              </form>
            </Form>
          )}

          {/* content display */}
          <p
            className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              props.deleted &&
                "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}
          >
            {props.content}
            {props.isUpdated && !props.deleted && (
              <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                (edited)
              </span>
            )}
          </p>
        </div>

        {/* content status and actions */}
        {canDeleteMessage && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash
                onClick={() =>
                  onOpen("DELETE_MESSAGE", {
                    apiUrl: `${props.socketUrl}/${props.id}`,
                    query: props.socketQuery,
                  })
                }
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
