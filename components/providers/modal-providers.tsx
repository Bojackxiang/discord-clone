"use client";

import React, { useEffect, useState } from "react";
import InitialModal from "../modals/InitialModal";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";
import EditServerModal from "../modals/EditServerModal";
import MemberManageModal from "../modals/MembersManageModal";
import CreateChannelModal from "../modals/CreateChannelModal";
import LeaveServerModal from "../modals/LeaveServerModal";
import DeleteChannelModal from "../modals/DeleteChannelModal";
import EditChannelModal from "../modals/EditChannelModal";
import MessageFileModal from "../modals/MessageFileModal";

const ModalProviders = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }
  return (
    <>
      <MessageFileModal/>
      <EditChannelModal/>
      <DeleteChannelModal />
      <LeaveServerModal />
      <CreateChannelModal />
      <MemberManageModal />
      <EditServerModal />
      <InviteModal />
      <CreateServerModal />
    </>
  );
};

export default ModalProviders;
