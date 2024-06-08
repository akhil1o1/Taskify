import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";

interface BoardProps {
   id: string;
   orgId: string;
   title: string;
}

export default function Board({ id, orgId, title }: BoardProps) {
   return (
      <li className="flex items-center justify-between gap-x-2 mb-2">
         <form action={deleteBoard.bind(null, orgId, id)}>
            {title}{" "}
            <Button variant={"destructive"} size={"sm"}>
               Delete
            </Button>
         </form>
      </li>
   );
}
