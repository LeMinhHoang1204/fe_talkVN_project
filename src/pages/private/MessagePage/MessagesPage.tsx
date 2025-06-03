import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MessageItemInList, {
  MessageItemInListDTO,
} from "../../../components/MessageItemInList";
import UserNameDisplay from "../../../components/UserNameDisplay";
import {
  GET_CONVERSATION_LIST_PAGE_SIZE,
  useCreateConversationByUsernameMutation,
  useGetConversationListQuery,
  useLazyGetConversationListByUsernameQuery,
} from "../../../data/conversation/conversation.api";
import { GlobalState } from "../../../data/global/global.slice";
import { socketBaseUrl } from "../../../helpers/constants/configs.constant";
import { WEB_SOCKET_EVENT } from "../../../helpers/constants/websocket-event.constant";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { UserDTO } from "../../../types/data.type";
import Conversation from "../components/Conversation";

type ConversationProps = {
  conversationId?: string;
  chatter?: UserDTO[];
  lastChatterActiveTime?: number;
  connection?: HubConnection | null;
};

function MessagesPage({ ...props }: ConversationProps) {
  const { userInfo }: GlobalState = useAppSelector((state) => state.global);
  const { groupId } = useParams();
  const isGroupChat = !!groupId;

  const { data: messageListData, refetch } = useGetConversationListQuery({
    PageIndex: 1,
    PageSize: GET_CONVERSATION_LIST_PAGE_SIZE,
    groupId: isGroupChat ? groupId : undefined, // Truyền groupId
    endpoint: isGroupChat ? `/Group/get-all-text-chats` : undefined,
  });

  const [chatter, setChatter] = useState<UserDTO[]>();

  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    messageListData?.data?.[0]?.messageId || ""
  );
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const [createConversation] = useCreateConversationByUsernameMutation();

  const [refetchConversationList] = useLazyGetConversationListByUsernameQuery();
  const [searchResult, setSearchResult] = useState<
    MessageItemInListDTO[] | null
  >(null);
  const messagesToRender = searchResult ?? messageListData?.data ?? [];

  const [searchedUsers, setSearchedUsers] = useState<UserDTO[]>([]);

  function autoCaplock(str: string): string {
    return str.toUpperCase();
  }
  useEffect(() => {
    const setupSignalR = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${socketBaseUrl}/hubs/textchat`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      try {
        await newConnection.start();
        setConnection(newConnection);
        console.log("SignalR connection established");
      } catch (error) {
        console.error(
          "SignalR connection error:",
          JSON.stringify(error, null, 2)
        );
      }
    };

    setupSignalR();

    return () => {
      connection?.stop();
    };
  }, []);

  const handleUsernameSearch = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const rawInput = (e.target as HTMLInputElement).value.trim();

    if (!rawInput) {
      setSearchResult(null);
      return;
    }

    const usernames = rawInput
      .split(",")
      .map((u) => u.trim().replace(/^@/, ""))
      .filter((u) => u.length > 0 && u !== userInfo.username);

    if (usernames.length === 0) {
      enqueueSnackbar("Không có username hợp lệ", { variant: "warning" });
      return;
    }

    try {
      const { data, searchedUsers } = await refetchConversationList({
        PageIndex: 1,
        PageSize: 10,
        usernames: usernames,
      }).unwrap();

      setSearchResult(data);
      setSearchedUsers(searchedUsers);
    } catch (err) {
      enqueueSnackbar("Không tìm thấy người dùng", { variant: "error" });
    } finally {
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleCreateConversation = async () => {
    try {
      await createConversation({
        userIds: searchedUsers.map((user) => user.id),
      });
    } catch (error) {
      console.error("Lỗi tạo đoạn chat:", error);
      enqueueSnackbar("Không thể tạo đoạn chat", { variant: "error" });
    } finally {
      setSearchResult(null);
      setSearchedUsers([]);
      await refetch().then(() => {
        enqueueSnackbar("Tạo đoạn chat thành công", { variant: "success" });
      });
    }
  };

  return (
    <div className="flex flex-row w-300px h-full bg-[#2B2D31]">
      <div className="flex flex-col md:w-[310px] h-full overflow-auto">
        <div className="box-border flex items-center justify-between h-[70px] px-4 py-3 border-b-[2px] border-black/50">
          <span className="font-bold text-white flex justify-center items-center w-full">
            {isGroupChat ? "Group Chat" : "Messages"}
          </span>
        </div>

        <div className="w-full h-auto">
          <div className="flex flex-row justify-between px-2">
            <div className="flex flex-col gap-2 px-2 py-2">
              <div className="flex flex-row justify-between items-center">
                <UserNameDisplay
                  id={userInfo.userId}
                  className="text-blue-400"
                  username={`@${userInfo.username}`}
                />
              </div>

              {/* Tim chat */}
              <input
                type="text"
                list="usernames"
                placeholder="Nhập @username để bắt đầu chat"
                className="w-[280px] px-4 py-2 text-sm border border-gray-300 rounded-xl shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                onKeyDown={handleUsernameSearch}
              />
              <p className="text-s text-gray-500 px-1 pt-1">
                🔹 Nếu đăng nhập bằng Google, tên người dùng mặc định là email
                của bạn.
              </p>

              <datalist id="usernames">
                <option value="admin" />
                <option value="admin1" />
              </datalist>
            </div>
          </div>
        </div>

        <div className="flex flex-row px-4 py-2 overflow-y-auto text-[#80848E]">
          <div className="font-bold px-4 pt-2">{autoCaplock("Channels")}</div>
        </div>

        {/* A message is a conversation */}
        <div className="flex flex-col mx-3">
          {messagesToRender.map((message) => (
            <MessageItemInList
              connection={connection}
              onCurrentSelectedMessage={() =>
                setSelectedMessageId(message.messageId)
              }
              setChatter={setChatter}
              isActive={selectedMessageId === message.messageId}
              key={message.messageId}
              messageItemData={message}
            />
          ))}
          {messagesToRender.length === 0 && (
            // <></>}
            <div className="h-full flex flex-col justify-center items-center">
              {/* <ImageWithFallback
            className="h-24 w-24"
            src="/assets/images/empty-message.svg"
            alt="empty-message"
          /> */}
              {
                "No messages yet. Start a conversation by sending a message to someone."
              }
            </div>
          )}

          <div className="flex flex-row px-4 py-2 overflow-y-auto text-[#80848E]">
            <div className="font-bold px-4 pt-2">
              {autoCaplock("Video channel")}
            </div>
          </div>

          <button
            onClick={() => {
              const videoCallUrl = `/video/${props?.conversationId}`;
              window.open(videoCallUrl, "_blank", "width=800,height=600");
              connection?.invoke(
                WEB_SOCKET_EVENT.START_CALL,
                props?.conversationId
              );
            }}
          >
            <div className="flex-col">
              <div
                className="text-[#80848E] group flex items-center relative mt-2 ml-[10px] p-[2px] cursor-pointer hover:bg-[#3A3C40] hover:text-[#DBDEE1] rounded-[4px] transition duration-200 ease-in-out"
                // className="text-[#80848E] group flex items-center relative mt-2 ml-[10px] p-[2px] cursor-pointer hover:bg-[#3A3C40] hover:text-[#DBDEE1] rounded-[4px] transition duration-200 ease-in-out"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {/* Icon loa */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  className="mr-2"
                >
                  <path
                    d="M17.2848 4.59186C18.984 6.29158 19.9386 8.5966 19.9386 11C19.9386 13.4034 18.984 15.7084 17.2848 17.4082M14.0852 7.7914C14.9348 8.64126 15.4121 9.79377 15.4121 10.9955C15.4121 12.1972 14.9348 13.3497 14.0852 14.1996M9.97025 4.65531L5.43832 8.28085H1.81277V13.7192H5.43832L9.97025 17.3447V4.65531Z"
                    stroke="#F5F5F5"
                    stroke-opacity="0.4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Video channel 1
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="w-[1130px]">
        {chatter && (
          <Conversation
            connection={connection}
            lastChatterActiveTime={Date.now()}
            chatter={chatter}
            conversationId={selectedMessageId}
          />
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
