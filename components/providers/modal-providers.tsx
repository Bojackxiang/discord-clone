"use client";

import React, { useEffect, useState } from "react";
import InitialModal from "../modals/InitialModal";
import CreateServerModal from "../modals/CreateServerModal";

const ModalProviders = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }
  return <>
    <CreateServerModal/>
  </>;
};

export default ModalProviders;
