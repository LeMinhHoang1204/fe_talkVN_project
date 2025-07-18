export type UserReceiverRES = {
  id: string;
  displayName: string;
  avatarUrl: string;
};

export type MessageRES = {
  id: string;
  messageText: string;
  createdOn: number;
  updatedOn: number;
  senderId: string;
  conversationId: string;
  status: string;
};

export type GetConversationListItemRES = {
  id: string;
  userReceivers: UserReceiverRES[];
  lastMessage: MessageRES | null;
  isSeen: boolean;
  userReceiverIds: { id: string; displayName: string; avatarUrl: string }[];
  textChatType: string;
  name: string;
  groupId: string;
};

export type GetConversationFoundByUsernameListItemRES = {
  conversations: GetConversationListItemRES[];
  searchedUsers: UserReceiverRES[];
};

export type GetConversationDetailRES = {
  id: string;
  userReceivers: UserReceiverRES[];
  userReceiverIds: string[];
  messages: MessageRES[];
};
