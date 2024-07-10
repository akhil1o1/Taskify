import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET(
   request: Request,
   { params }: { params: { cardId: string } }
) {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return NextResponse.json("Unauthorized", { status: 401 });
   }

   const cardId = params.cardId;

   try {
      const card = await db.card.findUnique({
         where: {
            id: cardId,
            list: {
               board: {
                  orgId: orgId,
               },
            },
         },
         include: {
            // include corresponding list title in response
            list: {
               select: {
                  title: true,
               },
            },
            attachments: {orderBy : {createdAt : "desc"}},
         },
      });

      return NextResponse.json(card, { status: 200 });
   } catch (error) {
      return NextResponse.json("Internal server error", { status: 500 });
   }
}
