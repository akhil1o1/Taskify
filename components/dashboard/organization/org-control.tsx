"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useOrganizationList } from "@clerk/nextjs";

// component for programatically changing organization if user changes the orgId in the url mannually

export default function OrgControl() {
   const params = useParams();
   const { setActive } = useOrganizationList();

   useEffect(() => {
      if (!setActive) {
         return;
      }
      setActive({
         organization: params.organizationId as string,
      });
   }, [setActive, params.organizationId]);
   return null;
}
