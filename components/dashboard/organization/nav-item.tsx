"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import {
   AccordionItem,
   AccordionTrigger,
   AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export type Organization = {
   id: string;
   slug: string;
   imageUrl: string;
   name: string;
};

interface NavItemProps {
   isActive: boolean;
   isExpanded: boolean;
   onExpand: (id: string) => void;
   organization: Organization;
}

export default function NavItem({
   isActive,
   isExpanded,
   onExpand,
   organization,
}: NavItemProps) {
   const router = useRouter();
   const pathname = usePathname();

   const routes = [
      {
         label: "Boards",
         icon: <Layout className="h-4 w-4 mr-2" />,
         href: `/organization/${organization.id}`,
      },
      {
         label: "Activity",
         icon: <Activity className="h-4 w-4 mr-2" />,
         href: `/organization/${organization.id}/activity`,
      },
      {
         label: "Settings",
         icon: <Settings className="h-4 w-4 mr-2" />,
         href: `/organization/${organization.id}/settings`,
      },
      {
         label: "Billing",
         icon: <CreditCard className="h-4 w-4 mr-2" />,
         href: `/organization/${organization.id}/billing`,
      },
   ];

   function onClick(href: string) {
      router.push(href);
   }

   return (
      <AccordionItem value={organization.id} className="border-none">
         <AccordionTrigger
            onClick={() => onExpand(organization.id)}
            className={cn(
               "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
               isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
            )}
         >
            <div className="flex items-center gap-x-2">
               <div className="w-7 h-7 relative">
                  <Image
                     fill
                     src={organization.imageUrl}
                     alt="organization"
                     className="rounded-sm object-cover"
                  />
               </div>
               <span className="font-medium text-sm">{organization.name}</span>
            </div>
         </AccordionTrigger>
         <AccordionContent>
            {routes.map((route) => (
               <Button
                  key={route.href}
                  size={"sm"}
                  onClick={() => onClick(route.href)}
                  className={cn(
                     "w-full font-normal justify-start pl-10 mb-1",
                     pathname === route.href && "bg-sky-500/10 text-sky-700"
                  )}
                  variant={"ghost"}
               >
                  {route.icon}
                  {route.label}
               </Button>
            ))}
         </AccordionContent>
      </AccordionItem>
   );
}

NavItem.Skeleton = () => {
   return (
      <div className="flex items-center gap-x-2 mb-1">
         <div className="w-10 h-10 relative shrink-0">
            <Skeleton className="h-full w-full absolute" />
         </div>
         <Skeleton className="h-10 w-full" />
      </div>
   );
};
