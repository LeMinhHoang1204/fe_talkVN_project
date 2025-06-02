
export type GetConversationListItemREQ = {
  PageIndex?: number;
  PageSize?: number;
  usernames?: string[];
  endpoint?: string;
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
