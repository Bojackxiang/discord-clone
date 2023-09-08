import React from "react";
import { Server } from "@prisma/client";
import { redirect } from "next/navigation";

import NavItem from "./NavItem";
import NavAction from "./NavAction";
import { Separator } from "../ui/separator";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "../ui/scroll-area";
import { number } from "zod";

interface NavSideBarProps {}

const NavSideBar = async ({}: NavSideBarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      profileId: profile.id,
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((item: Server, index: number) => {
          return <div key={item.id}>
            <NavItem name={item.name} imageUrl={item.imageUrl} id={item.id} index={index}/>
          </div>;
        })}
      </ScrollArea>
    </div>
  );
};

export default NavSideBar;
