import { MessageItemInListDTO } from "../../components/MessageItemInList";
import { ConversationDTO } from "../../types/data.type";
import { GetConversationListItemRES, MessageRES } from "./conversation.res";

export const getMessageListItemDTO = (
  data: GetConversationListItemRES
): MessageItemInListDTO => ({
  messageId: data.id,
  latestMessage: data.lastMessage?.messageText,
  time: data.lastMessage?.updatedOn,
  isRead: data.isSeen,
  fromMe: data.lastMessage?.senderId === data.userReceivers[0].id,
  // receiverId: data.userReceivers[0].id,
  // userDisplayName: data.userReceivers[0].displayName,
  // userImageUrl: data.userReceivers[0].avatarUrl,
  // receiversId: data.userReceivers.map((user) => user.id),
  // usersDisplayName: data.userReceivers.map((user) => user.displayName),
  receivers : data.userReceivers.map((user) => ({
    id: user.id,
    username: user.displayName,
    userDisplayName: user.displayName,
    profileImage: {
      key: user.avatarUrl,
      url: user.avatarUrl,
    },
  })),
});

export const getMessageListDetailDTO = (
  data: MessageRES,
  id: string
): ConversationDTO => ({
  senderId: data.senderId,
  message: {
    messageId: data.id,
    content: data.messageText,
    updateTime: data.updatedOn,
    createTime: data.createdOn,
  },
  conversationId: id,
});
