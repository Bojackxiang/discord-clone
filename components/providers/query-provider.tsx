"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const QueryProvider = (params: { children: React.ReactNode }) => {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>{params.children}</QueryClientProvider>
  );
};

export default QueryProvider
