import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { usersApi } from "../usersApi.api";

export const permissionApi = usersApi.injectEndpoints({
  endpoints: (build) => ({
    checkPermission: build.mutation<
      { allowed: boolean; reason?: string },
      { action: string; conversationId?: string }
    >({
      query: (body) => ({
        url: "/permissions/check",
        method: HTTP_METHOD.POST,
        body,
      }),
    }),
  }),
});

export const { useCheckPermissionMutation } = permissionApi;