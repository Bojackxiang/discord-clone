"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { db } from "@/lib/db";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../UserAvatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

const ROLE_MAP = {
  GUEST: "",
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

interface MembersManageModalProps {}

const MembersManageModal: React.FC<MembersManageModalProps> = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const [loadingId, setLoadingId] = useState("");
  
  const router = useRouter();

  const isMembersManageModalOpen = isOpen && type === "MEMBER_MANAGEMENT";

  const onRoleChange = async (
    updatedRole: "GUEST" | "ADMIN" | "MODERATOR",
    profileId: string,
    memberId: string
  ) => {
    
    try {
      setLoadingId(memberId);
      const updatedServer = await axios.put(
        `/api/servers/${server.id}/member/${memberId}`,
        {
          role: updatedRole,
        }
      );
      router.refresh();
      onOpen("MEMBER_MANAGEMENT", { server: updatedServer.data });
    } catch (error: any) {
      console.error("MembersManageModal.tsx: ", error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isMembersManageModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Members management
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-700">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]  ">
          {server?.members?.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div>
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {ROLE_MAP[member.role]}
                  </div>
                  <p className="text-xs text-zinc-600">
                    {member.profile.email}
                  </p>
                </div>
                {server.profileId !== member.profile.id &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(
                                      "GUEST",
                                      member?.profileId,
                                      member.id
                                    )
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <span className="ml-auto text-zinc-600">
                                      <Check className="h-4 w-4 mr-2 text-zinc-500" />
                                    </span>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Admin
                                  {member.role === "ADMIN" && (
                                    <span className="ml-auto text-zinc-600">
                                      <Check className="h-4 w-4 mr-2 text-zinc-500" />
                                    </span>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(
                                      "MODERATOR",
                                      member?.profileId,
                                      member.id
                                    )
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <span className="ml-auto text-zinc-600">
                                      <Check className="h-4 w-4 mr-2 text-zinc-500" />
                                    </span>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Gavel className="h-4 w-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersManageModal;
