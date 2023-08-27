import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <section className="h-full flex justify-center items-center">{children}</section>;
};

export default AuthLayout;
