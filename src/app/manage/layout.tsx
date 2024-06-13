import React from "react";
import { SecurityCheck } from "./security-check";
import { SyncActiveOrganization } from "./sync-active-organization";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncActiveOrganization />
      <SecurityCheck>{children}</SecurityCheck>
    </>
  );
}
