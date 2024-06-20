import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import ModalProvider from "@/components/dashboard/providers/modal-provider";
import QueryProvider from "@/components/dashboard/providers/query-provider";

export default function PlatformLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <ClerkProvider>
         <QueryProvider>
            {children}
            <Toaster />
            <ModalProvider />
         </QueryProvider>
      </ClerkProvider>
   );
}
