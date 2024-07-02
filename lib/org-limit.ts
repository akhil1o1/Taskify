import { auth } from "@clerk/nextjs/server";

import { db } from "./db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

// helper functions for querying and mutating orgLimit/ org's board limits

export async function incrementAvailableCount() {
   const { orgId } = auth();

   if (!orgId) {
      throw new Error("Unauthorized!");
   }

   const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

   if (orgLimit) {
      // increase org's board limit
      await db.orgLimit.update({
         where: { orgId },
         data: {
            count: orgLimit.count + 1,
         },
      });
   } else {
      // when the first board is being created
      await db.orgLimit.create({
         data: {
            orgId,
            count: 1,
         },
      });
   }
}

export async function decrementAvailableCount() {
   const { orgId } = auth();

   if (!orgId) {
      throw new Error("Unauthorized!");
   }

   const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

   if (orgLimit) {
      // decrease org's board limit
      await db.orgLimit.update({
         where: { orgId },
         data: {
            count: orgLimit.count > 0 ? orgLimit.count - 1 : 0,
         },
      });
   } else {
      await db.orgLimit.create({
         data: {
            orgId,
            count: 1,
         },
      });
   }
}

export async function hasAvailableCount() {
   const { orgId } = auth();

   if (!orgId) {
      throw new Error("Unauthorized!");
   }

   const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

   if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
      // if no board is created or total number of boards is less than max free boards
      return true;
   } else {
      return false;
   }
}

export async function getAvailabelCount() {
   const { orgId } = auth();

   if (!orgId) {
      return 0; // no org hence no board is created yet
   }

   const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

   if (!orgLimit) {
      return 0; // no board is created yet
   }

   return orgLimit.count;
}
