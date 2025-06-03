export interface CreateGroupRequest {
    name: string;
    description: string;
    isPrivate: boolean;
    maxQuantity: number;
    password?: string;
}

export interface GroupData {
    id: string;
    name: string;
    isPrivate: boolean;
    avatar: string;
    url: string;
    description: string;
    status: number;
    maxQuantity: number;
    creator: {
        id: string;
        displayName: string;
        avatarUrl: string;
    };
    createdOn: string;
    updatedOn: string;
}

export interface getAllGroupResponse {
    succeeded: boolean;
    result: GroupData[];
    errors?: Array<{
        code: string;
        message: string;
    }>;
}

export interface BaseResponse<T> {
    succeeded: boolean;
    result: T;
    errors?: Array<{
        code: string;
        message: string;
    }>;
}

export type createGroupResponse = {
    succeeded: boolean;
    result: {
        id: string;
        name: string;
        isPrivate: boolean;
        avatar: string;
        url: string;
        description: string;
        status: number;
        maxQuantity: number;
        creator: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
        createdOn: string;
        updatedOn: string;
    };
    errors: Array<{
        code: string;
        message: string;
    }>;
};

export type getGroupMembersResponse = {
    succeeded: boolean;
    result: Array<{
        userId: string;
        user: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
        groupId: string;
        roleId: string;
        acceptedBy: string;
        invitedBy: string;
    }>;
    errors: Array<{
        code: string;
        message: string;
    }>
};

export type createGroupInvitationResponse = {
    succeeded: boolean;
    result: {
        id: string;
        invitationCode: string;
        invitationUrl: string;
        expirationDate: string;
        createdDate: string;
        groupId: string;
        inviterId: string;
    };
    errors: Array<{
        code: string;
        message: string;
    }>;
};

export type getGroupByInvitationCodeResponse = {
    succeeded: boolean;
    result: {
        id: string;
        name: string;
        isPrivate: boolean;
        avatar: string;
        url: string;
        description: string;
        status: number;
        maxQuantity: number;
        creator: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
        createdOn: string;
        updatedOn: string;
    };
    errors: Array<{
        code: string;
        message: string;
    }>;
};

