export type CreateGroupRequest = {
  name: string;
  isPrivate: boolean;
  password: string;
  description: string;
  maxQuantity: number;
};

export type RequestJoinGroup = {
  groupId: string;
  invitationCode: string;
};

export type ApproveJoinGroupRequest = {
  joinGroupRequestId: string;
};

export type GetGroupRequest = {
  groupId: string;
};

export type JoinGroupRequestDto = {
  groupId: string;
};
