import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/logo";

export function Footer() {
   return (
      <div className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
         <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
            <Logo />
            <div className="space-x-4 flex md:block w-full md:w-auto items-center justify-between">
               <Button size={"sm"} variant={"ghost"}>
                  Privacy Policy
               </Button>
               <Button size={"sm"} variant={"ghost"}>
                  Terms of Conditions
               </Button>
            </div>
         </div>
      </div>
   );
}
