"use client";

import { useEffect, useState } from "react";
import CardModal from "../modals/card-modal";

export default function ModalProvider() {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) {
      // to prevent hydration error
      return null;
   }

   return (
      <>
         <CardModal />
      </>
   );
}
