"use client";

import React, { useEffect, useState } from "react";
import InitialModal from "../modals/InitialModal";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";

const ModalProviders = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }
  return <>
    <InitialModal/>
    <InviteModal/>
    <CreateServerModal/>
  </>;
};

export default ModalProviders;
