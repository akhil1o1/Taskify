"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@prisma/client";

import { CardWithLists } from "@/types";
import fetcher from "@/lib/fetcher";
import { useCardModal } from "@/hooks/use-card-modal";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "./header";
import Description from "./description";
import CardActions from "./card-actions";
import Activity from "./activity";
import AddToCard from "./add-to-card";
import AttachmentList from "./attachment-list";

export default function CardModal() {
   const { id, isOpen, onClose } = useCardModal();

   const { data: cardData, refetch: refetchCardData } = useQuery<CardWithLists>(
      {
         queryKey: ["card", id],
         queryFn: () => fetcher(`/api/cards/${id}`),
      }
   );

   const { data: auditLogsData, refetch: refetchAuditLogs } = useQuery<
      AuditLog[]
   >({
      queryKey: ["card-logs", id],
      queryFn: () => fetcher(`/api/cards/${id}/logs`),
   });

   console.log(cardData);
   console.log(auditLogsData);

   function refetchData() {
      refetchCardData();
      refetchAuditLogs();
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            {!cardData ? (
               <Header.Skeleton />
            ) : (
               <Header data={cardData} refetchData={refetchData} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
               <div className="col-span-3">
                  <div className="w-full space-y-6">
                     {!cardData ? (
                        <Description.Skeleton />
                     ) : (
                        <Description
                           data={cardData}
                           refetchData={refetchData}
                        />
                     )}
                     {cardData?.attachments.length ? (
                        <AttachmentList
                           data={cardData}
                           refetchData={refetchData}
                        />
                     ) : undefined}
                     {!auditLogsData ? (
                        <Activity.Skeleton />
                     ) : (
                        <Activity items={auditLogsData} />
                     )}
                  </div>
               </div>
               <div className="space-y-6">
                  {!cardData ? (
                     <>
                        <AddToCard.Skeleton />
                        <CardActions.Skeleton />
                     </>
                  ) : (
                     <>
                        <AddToCard refetchData={refetchData} data={cardData} />
                        <CardActions data={cardData} />
                     </>
                  )}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
