import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HTTP_METHOD } from "../../helpers/constants/common.constant";
import { apiBaseUrl } from "../../helpers/constants/configs.constant";
import { BaseResponse } from "../../types/data.type";
import { LoginREQ } from "./auth.request";
import { LoginRES } from "./auth.response";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiBaseUrl}/User`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<BaseResponse<LoginRES>, LoginREQ>({
      query: (body) => ({
        url: "/login",
        method: HTTP_METHOD.POST,
        body,
      }),
    }),

    exchangeAuthCode: builder.mutation<BaseResponse<LoginRES>, { authCode: string }>({
      query: ({ authCode }) => ({
        url: `/exchange-authcode?authCode=${authCode}`,
        method: HTTP_METHOD.POST,
      }),
    }),

  }),
});

export const { useLoginMutation, useExchangeAuthCodeMutation } = authApi;

export default authApi;
