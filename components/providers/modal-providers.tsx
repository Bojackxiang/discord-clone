"use client";

import React, { useEffect, useState } from "react";
import InitialModal from "../modals/InitialModal";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";
import EditServerModal from "../modals/EditServerModal";
import MemberManageModal from "../modals/MembersManageModal";
import CreateChannelModal from "../modals/CreateChannelModal";

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
      <CreateChannelModal />
      <MemberManageModal />
      <EditServerModal />
      <InviteModal />
      <CreateServerModal />
    </>
  );
};

export default ModalProviders;
