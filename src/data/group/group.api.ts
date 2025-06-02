import { getAllGroupResponse } from "./group.res";

export const getAllGroup = async (pageIndex: number = 0, pageSize: number = 12) => {
    try {
        const response = await fetch(`/api/Group?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data: getAllGroupResponse = await response.json();
        
        return {
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
                creator: group.creator
                    ? {
                            id: group.creator.id,
                            displayName: group.creator.displayName,
                            avatarUrl: group.creator.avatarUrl,
                    }
                    : undefined,
                createdOn: group.createdOn,
                updatedOn: group.updatedOn,
            })) ?? [],
            errors: data.errors?.map(error => ({
                code: error.code,
                message: error.message,
            })) ?? [],
        };
    } catch (error) {
        return {
            succeeded: false,
            groups: [],
            errors: [{ code: 'FETCH_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }],
        };
    }
};