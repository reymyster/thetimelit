"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

const hOrgID = "org_2hoS3zFJQEpDdmBY7e5PA8jfgWx";

export function SyncActiveOrganization() {
  const { setActive, isLoaded } = useOrganizationList();

  // Get the organization ID from the session
  const { orgId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (hOrgID !== orgId) {
      void setActive({ organization: hOrgID });
    }
  }, [orgId, isLoaded, setActive]);

  return null;
}
