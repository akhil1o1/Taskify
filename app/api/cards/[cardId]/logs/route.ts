import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET(
   request: Request,
   { params }: { params: { cardId: string } }
) {
   const { userId, orgId } = auth();

   if (!userId || !orgId) {
      return NextResponse.json("Unauthorized", {
         status: 401,
      });
   }

   const cardId = params.cardId;

   try {
      const auditLogs = await db.auditLog.findMany({
         where: {
            entityId: cardId,
            entityType: ENTITY_TYPE.CARD,
         },
         orderBy: {
            createdAt: "desc",
         },
         take: 3, // only 3 latest audit logs
      });

      return NextResponse.json(auditLogs, { status: 200 });
   } catch (error) {
      return NextResponse.json("Internal server error", {
         status: 500,
      });
   }
}
