"use client";

import { useParams } from "next/navigation";
import { Copy, Trash } from "lucide-react";

import { CardWithLists } from "@/types";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ActionsProps {
   data: CardWithLists;
}

export default function Actions({ data }: ActionsProps) {
   const params = useParams();

   const { onClose } = useCardModal();

   const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
      copyCard,
      {
         onSuccess: (data) => {
            toast.success(`card copied successfully`);
            onClose();
         },
         onError: (error) => {
            toast.error(error);
         },
      }
   );

   const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
      deleteCard,
      {
         onSuccess: (data) => {
            toast.success(`card deleted successfully`);
            onClose();
         },
         onError: (error) => {
            toast.error(error);
         },
      }
   );

   function onCopy() {
      const boardId = params.boardId as string;
      const id = data.id;
      executeCopyCard({ id, boardId });
   }

   function onDelete() {
      const boardId = params.boardId as string;
      const id = data.id;
      executeDeleteCard({ id, boardId });
   }

   return (
      <div className="space-y-2 mt-2">
         <p className="text-xs font-semibold">Actions</p>
         <Button
            variant={"gray"}
            className="w-full justify-start"
            size={"inline"}
            onClick={onCopy}
            disabled={isLoadingCopy}
         >
            <Copy className="h-4 w-4 mr-2" />
            Copy
         </Button>
         <Button
            variant={"gray"}
            className="w-full justify-start"
            size={"inline"}
            onClick={onDelete}
            disabled={isLoadingDelete}
         >
            <Trash className="h-4 w-4 mr-2" />
            Delete
         </Button>
      </div>
   );
}

Actions.Skeleton = () => {
   return (
      <div className="space-y-2 mt-2">
         <Skeleton className="w-20 h-4 bg-neutral-200" />
         <Skeleton className="w-full h-8 bg-neutral-200" />
         <Skeleton className="w-full h-8 bg-neutral-200" />
      </div>
   );
};
