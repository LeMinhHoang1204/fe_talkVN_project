import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { BaseResponse } from "../../types/data.type";
import { usersApi } from "../usersApi.api";
import {
  CreateGroupRequest,
  GroupData,
  createGroupResponse,
  getAllGroupResponse,
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

    getUserCreatedGroups: build.query<
      GroupData[],
      { pageIndex?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: `/Group/get-user-created-groups`,
        method: HTTP_METHOD.GET,
        params: {
          PageIndex: params.pageIndex || 1,
          PageSize: params.pageSize || 12,
        },
      }),
      transformResponse: (response: BaseResponse<GroupData[]>) => {
        console.log("Raw API Response:", response);
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
  }),
});

export const {
  useGetAllGroupsQuery,
  useGetUserCreatedGroupsQuery,
  useLazyGetUserCreatedGroupsQuery,
  useCreateGroupMutation,
} = groupApi;
