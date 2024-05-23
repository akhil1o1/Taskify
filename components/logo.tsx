import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";

import { cn } from "@/lib/utils";
import logoImage from "@/public/logo.svg";

const headingFont = Jost({
   subsets: ["latin"],
   display: "swap",
});

export default function Logo() {
   return (
      <Link href={"/"}>
         <div className=" hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
            <Image src={logoImage} alt="Taskify logo" width={30} height={30} />
            <p
               className={cn(
                  "text-lg text-neutral-700 pb-1",
                  headingFont.className
               )}
            >
               Taskify
            </p>
         </div>
      </Link>
   );
}
