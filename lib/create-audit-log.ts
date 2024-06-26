import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "./db";

interface Props {
   entityId: string;
   entityType: ENTITY_TYPE;
   entityTitle: string;
   action: ACTION;
}

export async function createAuditLog(props: Props) {
   try {
      const { orgId } = auth();
      const user = await currentUser();

      if (!user || !orgId) {
         throw new Error("User not found");
      }

      const { entityId, entityType, entityTitle, action } = props;

      await db.auditLog.create({
         data: {
            orgId,
            entityId,
            entityTitle,
            entityType,
            action,
            userId: user.id,
            userName: user?.firstName + " " + user?.lastName,
            userImage: user?.imageUrl,
         },
      });
   } catch (error) {
      console.log("AUDIT_LOG_ERROR", error);
   }
}
