import { Card, List, Attachment } from "@prisma/client";

export type ListWithCards = List & { cards: CardWithAttachments[] };

export type CardWithLists = CardWithAttachments & { list: List };

export type CardWithAttachments = Card & { attachments: Attachment[] };
