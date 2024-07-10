"use client";

import { Tag } from "lucide-react";

import { CardWithLists } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Attachments from "./attachments";

interface AddToCardProps {
   data: CardWithLists;
   refetchData : () => void;
}

export default function AddToCard({ data, refetchData }: AddToCardProps) {
   return (
      <div className="space-y-2 mt-2">
         <p className="text-xs font-semibold">Add to card</p>
         <Button
            variant={"gray"}
            className="w-full justify-start"
            size={"inline"}
         >
            <Tag className="h-4 w-4 mr-2" />
            Label
         </Button>
         <Attachments data={data} refetchData={refetchData}/>
      </div>
   );
}

AddToCard.Skeleton = () => {
   return (
      <div className="space-y-2 mt-2">
         <Skeleton className="w-20 h-4 bg-neutral-200" />
         <Skeleton className="w-full h-8 bg-neutral-200" />
         <Skeleton className="w-full h-8 bg-neutral-200" />
      </div>
   );
};
