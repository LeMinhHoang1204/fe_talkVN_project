import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { BaseResponse } from "../../types/data.type";
import { usersApi } from "../usersApi.api";
import { GetGroupRequest } from "./group.req";
import { CreateGroupRequest, GroupData, createGroupResponse, getAllGroupResponse, getGroupByInvitationCodeResponse, getGroupChannelsResponse } from "./group.res";

const groupApi = usersApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGroups: build.query<getAllGroupResponse, { pageIndex?: number; pageSize?: number }>({
      query: (params) => ({
        url: `/Group`,
        method: HTTP_METHOD.GET,
        params: {
          PageIndex: params.pageIndex || 1,
          PageSize: params.pageSize || 12,
        },
      }),
      transformResponse: (response: BaseResponse<getAllGroupResponse>) => response.result,
    }),
    
    getUserJoinedGroups: build.query<GroupData[], { pageIndex?: number; pageSize?: number }>({
      query: (params) => ({
        url: `/Group/get-joined-groups`,
        method: HTTP_METHOD.GET,
        params: {
          PageIndex: params.pageIndex || 1,
          PageSize: params.pageSize || 12,
        },
      }),
      transformResponse: (response: BaseResponse<GroupData[]>) => {
        // console.log("Raw API Response:", response);
        return response?.result || [];
      },
    }),

    createGroup: build.mutation<createGroupResponse, CreateGroupRequest>({
      query: (body) => ({
        url: '/Group',
        method: HTTP_METHOD.POST,
        body,
      }),
    }),

    getGroupByInvitationCode: build.query<getGroupByInvitationCodeResponse, { invitationCode: string }>({
      query: ({ invitationCode }) => ({
        url: `/Group/get-by-invitation-code`,
        method: HTTP_METHOD.GET,
        params: { invitationCode },
      }),
    }),

    getGroupChannels: build.query<getGroupChannelsResponse, GetGroupRequest>({
      query: ({ groupId }) => ({
      url: `/Group/${groupId}`,
      method: HTTP_METHOD.GET,
      }),
      transformResponse: (response: BaseResponse<getGroupChannelsResponse>) => response.result,
    }),

    createInvitation: build.mutation<{ result: { invitationUrl: string } }, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/Group/create-invitation`,
        method: 'POST',
        params: { groupId },
      }),
    }),

    searchGroupByUsernames: build.query<any[], { usernames: string; PageIndex?: number; PageSize?: number }>({
      query: ({ usernames, PageIndex = 1, PageSize = 10 }) => ({
        url: `/Group/search-by-usernames`,
        method: 'GET',
        params: { usernames, PageIndex, PageSize },
      }),
      transformResponse: (response: BaseResponse<any[]>) => response.result || [],
    }),

    sendInvite: build.mutation<any, { groupId: string; targetUserId: string; senderUserId: string }>({
      query: (body) => ({
        url: '/Group/send-invite',
        method: 'POST',
        body,
      }),
    }),

    updateRoleUser: build.mutation<any, { groupId: string; userId: string; roleId: string }>({
      query: (body) => ({
        url: '/Group/update-user-role',
        method: 'POST',
        body,
      }),
    }),

    overridePermission: build.mutation<any, { groupId: string; userId: string; permission: string; value: boolean }>({
      query: (body) => ({
        url: '/Group/override-permission',
        method: 'POST',
        body,
      }),
    }),

    getGroupMembers: build.query<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/Group/get-members`,
        method: HTTP_METHOD.GET,
        params: { groupId },
      }),
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useGetUserJoinedGroupsQuery,
  useLazyGetUserJoinedGroupsQuery,
  useCreateGroupMutation,
  useGetGroupByInvitationCodeQuery,
  useGetGroupChannelsQuery,
  useCreateInvitationMutation,
  useSearchGroupByUsernamesQuery,
  useLazySearchGroupByUsernamesQuery,
  useSendInviteMutation,
  useUpdateRoleUserMutation,
  useOverridePermissionMutation,
  useGetGroupMembersQuery,
} = groupApi;