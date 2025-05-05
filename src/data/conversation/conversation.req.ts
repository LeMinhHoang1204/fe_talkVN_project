import { PaginationREQ } from "../../types/data.type";

export type GetConversationListItemREQ = PaginationREQ & {
  usernames?: string[];
};

export type GetConversationListREQ = {
  conversationId: string;
  messagePageIndex: number;
  messagePageSize: number;
  conversations?: object[];
};

export type PostAddNewMessageREQ = {
  conversationId: string;
  messageText: string;
};
