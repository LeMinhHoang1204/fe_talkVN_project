export type BaseResponse<T> = {
  succeed: boolean;
  result: T;
  errors: [];
};

export type PaginationDTO<T> = {
  data: T[];
} & {
  isLastPage: boolean;
};

export type PaginationREQ = {
  PageIndex: number;
  PageSize: number;
};

export type PostDTO = {
  id: string;
  postAt: number;
  postUser: UserDTO;
  postImages: ImageDTO[];
  likeCount: number;
  caption: string;
  commentCount: number;
  isLiked: boolean;
};

export type ImageDTO = {
  key: string;
  url: string;
};

export type UserDTO = {
  id: string;
  username: string;
  userDisplayName: string;
  profileImage: ImageDTO;
};

export type MessageDTO = {
  messageId: string;
  content: string;
  updateTime: number;
  createTime: number;
};

export type ConversationDTO = {
  conversationId: string;
  senderId: string;
  message: MessageDTO;
};

export type ExploreItemInListDTO = {
  postId: string;
  postImage: ImageDTO;
  likeCount: number;
  commentCount: number;
};

export type CommentDTO = {
  id: string;
  commentAt: number;
  commentUser: UserDTO;
  comment: string;
};

export type PostDetailDTO = {
  post: PostDTO;
  comments: CommentDTO[];
};

export type ProfileDetailDTO = {
  id: string;
  username: string;
  userDisplayName: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  profileImage: ImageDTO;
  bio: string;
  isFollowed: boolean;
};

export enum NOTIFICATION_TYPE {
  LIKE_POST = "LIKE_POST",
  LIKE_COMMENT = "LIKE_COMMENT",
  FOLLOWING = "FOLLOWING",
}

export type NotificationDTO = {
  id: string;
  notificationType: NOTIFICATION_TYPE;
  notificationAt: number;
  userNoti: UserDTO;
  isRead: boolean;
  notificationContent: string;
};

export type ConversationInformationDTO = {
  conversationId: string;
  chatter: UserDTO[];
};

<<<<<<< HEAD
export interface GroupDTO {
  id: string;
  name: string;
  isPrivate: boolean;
  url: string;
  description: string;
  status: number;
  maxQuantity: number;
  creator: {
=======
export type GroupDTO = {
  userId: string;
  user: {
>>>>>>> 138d8a10853e7030f3e658a49174cd1342b0703f
    id: string;
    displayName: string;
    avatarUrl: string;
  };
<<<<<<< HEAD
  createdOn: string;
  updatedOn: string;
}

export interface CreateGroupDTO {
  name: string;
  isPrivate: boolean;
  password?: string;
  description?: string;
  maxQuantity?: number;
}
=======
  groupId: string;
  roleId: string;
  acceptedBy: string;
  invitedBy: string;
};
>>>>>>> 138d8a10853e7030f3e658a49174cd1342b0703f
