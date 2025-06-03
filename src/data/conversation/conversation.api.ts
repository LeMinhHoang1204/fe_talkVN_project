import {
  ConversationListWithUserIds,
  MessageItemInListDTO,
} from "../../components/MessageItemInList";
import {
  HTTP_METHOD,
  TAG_TYPES,
} from "../../helpers/constants/common.constant";
import {
  BaseResponse,
  ConversationDTO,
  ConversationInformationDTO,
  PaginationDTO,
} from "../../types/data.type";
import { usersApi } from "../usersApi.api";
import {
  GetConversationListItemREQ,
  GetConversationListREQ,
  PostAddNewMessageREQ,
} from "./conversation.req";
import {
  GetConversationDetailRES,
  GetConversationFoundByUsernameListItemRES,
  GetConversationListItemRES,
} from "./conversation.res";
import {
  getMessageListDetailDTO,
  getMessageListItemDTO,
} from "./conversation.service";

export const GET_CONVERSATION_LIST_PAGE_SIZE = 10;
export const GET_CONVERSATION_DETAIL_PAGE_SIZE = 100;

const conversationApi = usersApi.injectEndpoints({
  endpoints: (build) => ({
    getConversationList: build.query<
      PaginationDTO<MessageItemInListDTO>,
      GetConversationListItemREQ
    >({
      query: (params) => ({
        url: params.endpoint || `/Conversation`,
        method: HTTP_METHOD.GET,
        params: {
          PageIndex: params.PageIndex,
          PageSize: params.PageSize,
          usernames: params.usernames,
          groupId: params.groupId,
        },
      }),
      transformResponse: (
        response: BaseResponse<GetConversationListItemRES[]>
      ) => ({
        data: response.result.map((conversation) =>
          getMessageListItemDTO(conversation)
        ),
        isLastPage: response.result.length < GET_CONVERSATION_LIST_PAGE_SIZE,
      }),
      providesTags: [TAG_TYPES.CONVERSATION_LIST],
    }),

    getConversationDetail: build.query<
      PaginationDTO<ConversationDTO>,
      GetConversationListREQ
    >({
      query: (params) => ({
        url: `/Conversation/${params.conversationId}`,
        method: HTTP_METHOD.GET,
        params,
      }),
      transformResponse: (
        response: BaseResponse<GetConversationDetailRES>
      ) => ({
        data:
          response.result.messages.map((message) =>
            getMessageListDetailDTO(message, response.result.id)
          ) || [],
        isLastPage:
          response.result.messages.length < GET_CONVERSATION_DETAIL_PAGE_SIZE,
      }),
    }),

    postAddNewMessage: build.mutation<void, PostAddNewMessageREQ>({
      query: ({ conversationId, messageText }) => ({
        url: `/Conversation/${conversationId}`,
        method: HTTP_METHOD.POST,
        body: {
          messageText,
        },
      }),
      invalidatesTags: [{ type: TAG_TYPES.CONVERSATION_LIST }],
    }),
    getConversationInformation: build.query<ConversationInformationDTO, string>(
      {
        query: (conversationId: string) => ({
          url: `/Conversation/${conversationId}`,
          method: HTTP_METHOD.GET,
        }),
        transformResponse: (
          response: BaseResponse<GetConversationDetailRES>
        ) => ({
          conversationId: response.result.id,
          chatter: response.result.userReceivers.map((user) => ({
            id: user.id,
            username: user.displayName,
            userDisplayName: user.displayName,
            profileImage: {
              key: user.avatarUrl,
              url: user.avatarUrl,
            },
          })),
        }),
      }
    ),
    // search conversation by usernames
    getConversationListByUsername: build.query<
      ConversationListWithUserIds,
      GetConversationListItemREQ
    >({
      query: ({ PageIndex, PageSize, usernames }) => ({
        url: `/Conversation/search`,
        method: HTTP_METHOD.POST,
        params: { PageIndex, PageSize },
        body: { usernames },
      }),
      transformResponse: (
        response: BaseResponse<GetConversationFoundByUsernameListItemRES>
      ) => ({
        data: response.result.conversations.map((conversation) =>
          getMessageListItemDTO(conversation)
        ),
        searchedUsers: response.result.searchedUsers.map((user) => ({
          id: user.id,
          username: user.displayName,
          userDisplayName: user.displayName,
          profileImage: {
            key: user.avatarUrl,
            url: user.avatarUrl,
          },
        })),
        isLastPage:
          response.result.conversations.length <
          GET_CONVERSATION_LIST_PAGE_SIZE,
      }),
      providesTags: [TAG_TYPES.CONVERSATION_LIST],
    }),
    // create conversation by userIds
    createConversationByUsername: build.mutation<
      PaginationDTO<MessageItemInListDTO>, // kiểu dữ liệu trả về từ BE
      { userIds: string[] } // kiểu dữ liệu gửi lên
    >({
      query: (body) => ({
        url: `/Conversation`,
        method: HTTP_METHOD.POST,
        body,
      }),
    }),
  }),
});

export const {
  useGetConversationListQuery,
  useGetConversationDetailQuery,
  usePostAddNewMessageMutation,
  useLazyGetConversationInformationQuery,
  useLazyGetConversationListByUsernameQuery,
  useCreateConversationByUsernameMutation,
} = conversationApi;
