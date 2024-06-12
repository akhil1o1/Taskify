import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import Logo from "../shared/logo";
import { Button } from "../ui/button";
import { MobileSidebar } from "./organization/mobile-sidebar";
import FormPopover from "./organization/form/form-popover";

export default function DashboardNavbar() {
   return (
      <header className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
         <MobileSidebar />
         <div className="flex items-center gap-x-4">
            <div className="hidden md:flex">
               <Logo />
            </div>
            <FormPopover align="start" side="bottom" sideOffset={18}>
               <Button
                  size={"sm"}
                  className="rounded-sm hidden md:block h-auto py-1.5 px-2"
                  variant={"primary"}
               >
                  Create
               </Button>
            </FormPopover>

            <FormPopover>
               <Button size={"sm"} className="md:hidden" variant={"primary"}>
                  <Plus className="h-4 w-4" />
               </Button>
            </FormPopover>
         </div>

         <div className="ml-auto flex items-center gap-x-2">
            <OrganizationSwitcher
               hidePersonal
               afterCreateOrganizationUrl={"/organization/:id"}
               afterSelectOrganizationUrl={"/organization/:id"}
               afterLeaveOrganizationUrl={"/select-org"}
               appearance={{
                  elements: {
                     rootBox: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                     },
                     avatarBox: {
                        height: 30,
                        width: 30,
                     },
                  },
               }}
            />
            <UserButton
               afterSignOutUrl="/"
               appearance={{
                  elements: {
                     avatarBox: {
                        height: 30,
                        width: 30,
                     },
                  },
               }}
            />
         </div>
      </header>
   );
}
