import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <section className="bg-red-400 h-full">{children}</section>;
};

export default AuthLayout;
