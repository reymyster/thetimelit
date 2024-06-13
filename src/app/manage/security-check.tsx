import { auth } from "@clerk/nextjs/server";
import React from "react";

export function SecurityCheck({ children }: { children: React.ReactNode }) {
  const { has } = auth();

  const isAdmin = has({ role: "org:admin" });

  if (!isAdmin) return <span className={"text-red-700"}>Unauthorized.</span>;

  return <>{children}</>;
}
