import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ServerSidebar } from "./server/ServerSideBar";
import NavSideBar from "./nav/NavSideBar";

interface MobileToggleProps {
  serverId: string;
}

const MobileToggle = async (params: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavSideBar />
        </div>
        <ServerSidebar serverId={params.serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
