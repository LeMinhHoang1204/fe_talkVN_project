import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { BaseResponse } from "../../types/data.type";
import { usersApi } from "../usersApi.api";
import { GroupDTO, CreateGroupDTO } from "../../../src/types/data.type"; //

const groupApi = usersApi.injectEndpoints({
  endpoints: (build) => ({
    getGroupList: build.query<GroupDTO[], void>({
      query: () => ({
        url: `/Group`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response: BaseResponse<GroupDTO[]>) => {
        return response.result;
      },
    }),

    postGroup: build.mutation<GroupDTO, CreateGroupDTO>({
      query: (body) => ({
        url: `/Group`,
        method: HTTP_METHOD.POST,
        body,
      }),
      transformResponse: (response: BaseResponse<GroupDTO>) => response.result,
    }),
  }),
});

export const {
  useGetGroupListQuery,
  useLazyGetGroupListQuery,
  usePostGroupMutation,
} = groupApi;
