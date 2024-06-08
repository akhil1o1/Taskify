"use client";

import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import NavItem, { Organization } from "./nav-item";

interface SidebarProps {
   storageKey?: string;
}

export default function Sidebar({
   storageKey = "t-sidebar-state",
}: SidebarProps) {
   const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
      storageKey,
      {}
   );

   const { organization: activeOrganization, isLoaded: isLoadedOrg } =
      useOrganization();

   const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
      userMemberships: {
         infinite: true,
      },
   });

   const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
      (acc: string[], key: string) => {
         if (expanded[key]) {
            acc.push(key);
         }

         return acc;
      },
      []
   );

   function onExpand(id: string) {
      setExpanded((prevExpanded) => ({
         ...prevExpanded,
         [id]: !expanded[id],
      }));
   }

   if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
      return (
         <>
            <div className="flex items-center justify-between mb-2">
               <Skeleton className="w-[50%] h-10" />
               <Skeleton className="w-10 h-10" />
            </div>
            <NavItem.Skeleton />
            <NavItem.Skeleton />
            <NavItem.Skeleton />
         </>
      );
   }

   return (
      <aside>
         <div className="font-medium text-xs flex items-center mb-1">
            <span className="pl-4">Workpaces</span>
            <Button
               asChild
               type={"button"}
               size={"icon"}
               variant={"ghost"}
               className="ml-auto"
            >
               <Link href={"/select-org"}>
                  <Plus className="h4  w-4" />
               </Link>
            </Button>
         </div>

         <Accordion type={"multiple"} defaultValue={defaultAccordionValue}>
            {userMemberships?.data.map(({ organization }) => (
               <NavItem
                  key={organization.id}
                  isActive={activeOrganization?.id === organization.id}
                  organization={organization as Organization}
                  isExpanded={expanded[organization.id]}
                  onExpand={onExpand}
               />
            ))}
         </Accordion>
      </aside>
   );
}
