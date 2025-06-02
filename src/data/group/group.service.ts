import { createGroupInvitationResponse, getAllGroupResponse, getGroupByInvitationCodeResponse, getGroupMembersResponse } from "./group.res";

export const getAllGroupDTO = (
    data: getAllGroupResponse
) => ({
    succeeded: data.succeeded,
    groups: data.result?.map(group => ({
        id: group.id,
        name: group.name,
        isPrivate: group.isPrivate,
        avatar: group.avatar,
        url: group.url,
        description: group.description,
        status: group.status,
        maxQuantity: group.maxQuantity,
        creator: {
            id: group.creator.id,
            displayName: group.creator.displayName,
            avatarUrl: group.creator.avatarUrl,
        },
        createdOn: group.createdOn,
        updatedOn: group.updatedOn,
    })),
    errors: data.errors?.map(error => ({
        code: error.code,
        message: error.message,
    })),
});

export const getGroupMembersDTO = (
    data: getGroupMembersResponse
) => ({
    succeeded: data.succeeded,
    members: data.result?.map(member => ({
        userId: member.userId,
        user: {
            id: member.user.id,
            displayName: member.user.displayName,
            avatarUrl: member.user.avatarUrl,
        },
        groupId: member.groupId,
        roleId: member.roleId,
        acceptedBy: member.acceptedBy,
        invitedBy: member.invitedBy,
    })),
    errors: data.errors?.map(error => ({
        code: error.code,
        message: error.message,
    })),
});

export const createGroupInvitationDTO = (
    data: createGroupInvitationResponse
) => ({
    succeeded: data.succeeded,
    invitation: data.result && {
        id: data.result.id,
        invitationCode: data.result.invitationCode,
        invitationUrl: data.result.invitationUrl,
        expirationDate: data.result.expirationDate,
        createdDate: data.result.createdDate,
        groupId: data.result.groupId,
        inviterId: data.result.inviterId,
    },
    errors: data.errors?.map(error => ({
        code: error.code,
        message: error.message,
    })),
});

export const getGroupByInvitationCodeDTO = (
    data: getGroupByInvitationCodeResponse
) => ({
    succeeded: data.succeeded,
    group: data.result && {
        id: data.result.id,
        name: data.result.name,
        isPrivate: data.result.isPrivate,
        avatar: data.result.avatar,
        url: data.result.url,
        description: data.result.description,
        status: data.result.status,
        maxQuantity: data.result.maxQuantity,
        creator: {
            id: data.result.creator.id,
            displayName: data.result.creator.displayName,
            avatarUrl: data.result.creator.avatarUrl,
        },
        createdOn: data.result.createdOn,
        updatedOn: data.result.updatedOn,
    },
    errors: data.errors?.map(error => ({
        code: error.code,
        message: error.message,
    })),
});