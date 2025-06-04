import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { BaseResponse } from "../../types/data.type";
import { usersApi } from "../usersApi.api";
import { GetGroupRequest } from "./group.req";
import {
  CreateGroupRequest,
  GroupData,
  createGroupResponse,
  getAllGroupResponse,
  getGroupByInvitationCodeResponse,
  getGroupChannelsResponse,
  getJoinGroupRequestsResponse,
} from "./group.res";

const groupApi = usersApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGroups: build.query<
      getAllGroupResponse,
      { pageIndex?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: `/Group`,
        method: HTTP_METHOD.GET,
        params: {
          PageIndex: params.pageIndex || 1,
          PageSize: params.pageSize || 12,
        },
      }),
      transformResponse: (response: BaseResponse<getAllGroupResponse>) =>
        response.result,
    }),

    getJoinGroupRequests: build.query<
      getJoinGroupRequestsResponse,
      GetGroupRequest
    >({
      query: ({ groupId }) => ({
        url: `/Group/get-join-group-requests`,
        method: HTTP_METHOD.GET,
        params: { groupId },
      }),
      transformResponse: (
        response: BaseResponse<getJoinGroupRequestsResponse>
      ) => response.result,
    }),

    getUserJoinedGroups: build.query<
      GroupData[],
      { pageIndex?: number; pageSize?: number }
    >({
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
        url: "/Group",
        method: HTTP_METHOD.POST,
        body,
      }),
    }),

    getGroupByInvitationCode: build.query<
      getGroupByInvitationCodeResponse,
      { invitationCode: string }
    >({
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
      transformResponse: (response: BaseResponse<getGroupChannelsResponse>) =>
        response.result,
    }),

    approveJoinGroupRequest: build.mutation<
      string,
      { joinGroupRequestId: string }
    >({
      query: (body) => ({
        url: `/Group/approve-join-request`,
        method: HTTP_METHOD.PUT,
        body,
      }),
      transformResponse: (response: BaseResponse<string>) => response.result,
    }),

    rejectJoinGroupRequest: build.mutation<
      string,
      { joinGroupRequestId: string }
    >({
      query: (body) => ({
        url: `/Group/reject-join-request`,
        method: HTTP_METHOD.PUT,
        body,
      }),
      transformResponse: (response: BaseResponse<string>) => response.result,
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
  useGetJoinGroupRequestsQuery,
  useApproveJoinGroupRequestMutation,
  useRejectJoinGroupRequestMutation,
} = groupApi;
