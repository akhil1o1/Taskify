import { db } from "@/lib/db";
import Board from "./board";
import Form from "./form";

export default async function OrganizationIdPage({
   params,
}: {
   params: { organizationId: string };
}) {
   const boards = await db.board.findMany();

   return (
      <>
         <div>
            <Form orgId={params.organizationId} />
            <ul className="mt-4">
               {boards?.map((board) => (
                  <Board
                     key={board.id}
                     id={board.id}
                     orgId={params.organizationId}
                     title={board.title}
                  />
               ))}
            </ul>
         </div>
      </>
   );
}
