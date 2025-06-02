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