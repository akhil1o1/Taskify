import Link from "next/link";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export function Navbar() {
   return (
      <div className="fixed top-0 flex items-center w-full h-14 px-4 border-b shadow-sm bg-white">
         <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
            <Logo />
            <div className="space-x-4 flex md:block w-full md:w-auto items-center justify-between">
               <Button size={"sm"} variant={"outline"} asChild>
                  <Link href={"/sign-in"}>Login</Link>
               </Button>
               <Button size={"sm"} asChild>
                  <Link href={"/sign-up"}>Get taskify for free</Link>
               </Button>
            </div>
         </div>
      </div>
   );
}
