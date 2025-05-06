import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import MessageItemInList, { MessageItemInListDTO } from "../../../components/MessageItemInList";
import UserNameDisplay from "../../../components/UserNameDisplay";
import {
  GET_CONVERSATION_LIST_PAGE_SIZE,
  useCreateConversationByUsernameMutation,
  useGetConversationListQuery,
  useLazyGetConversationListByUsernameQuery,
} from "../../../data/conversation/conversation.api";
import { GlobalState } from "../../../data/global/global.slice";
import { socketBaseUrl } from "../../../helpers/constants/configs.constant";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { UserDTO } from "../../../types/data.type";
import Conversation from "../components/Conversation";

function MessagesPage() {
  const { userInfo }: GlobalState = useAppSelector((state) => state.global);

  const { data: messageListData, refetch } = useGetConversationListQuery({
    PageIndex: 1,
    PageSize: GET_CONVERSATION_LIST_PAGE_SIZE,
  });

  const [chatter, setChatter] = useState<UserDTO[]>();

  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    messageListData?.data?.[0]?.messageId || ""
  );
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const [createConversation] = useCreateConversationByUsernameMutation();

  const [refetchConversationList] = useLazyGetConversationListByUsernameQuery();
  const [searchResult, setSearchResult] = useState<MessageItemInListDTO[] | null>(null);
  const messagesToRender = searchResult ?? messageListData?.data ?? [];

  const [searchedUsers, setSearchedUsers] = useState<UserDTO[]>([]);
  
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
      await createConversation({ userIds: searchedUsers.map(user => user.id) });
    } catch (error) {
      console.error("Lỗi tạo đoạn chat:", error);
      enqueueSnackbar("Không thể tạo đoạn chat", { variant: "error" });
    }
    finally {
      setSearchResult(null);
      setSearchedUsers([]);
      await refetch().then(() => {
        enqueueSnackbar("Tạo đoạn chat thành công", { variant: "success" });
      });
    }
  };
  
  return (
    <div className="flex flex-row w-full h-full">
      <div className="border flex flex-col md:w-[420px] h-full overflow-auto">
        <div className="flex flex-row justify-between px-4 pt-8">
          <div className="flex flex-col gap-2 px-4 pt-6">
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
              🔹 Nếu đăng nhập bằng Google, tên người dùng mặc định là email của bạn.  
            </p>

            <datalist id="usernames">
              <option value="admin" /> 
              <option value="admin1" />
            </datalist>
          </div>

          {/* <UserNameDisplay
            id={userInfo.userId}
            className="text-blue-400"
            username={`@${userInfo.username}`}
          />
          <button>
            <OpenSendNewMessageOutlineIcon />
          </button> */}
        </div>
        <div className="flex flex-row px-4 py-2">
          <div className="font-bold">Messages</div>
        </div>

        {/* A message is a conversation */}
        <div className="flex flex-col mx-3">
          {messagesToRender.map((message) => (
            <MessageItemInList
              connection={connection}
              onCurrentSelectedMessage={() => setSelectedMessageId(message.messageId)}
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
          {searchedUsers.length > 0 && (
            <button
              onClick={handleCreateConversation}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tạo đoạn chat mới với @{searchedUsers.map(u => u.userDisplayName).join(", @")}
            </button>
          )}
        </div>
      </div>
      {chatter && (
        <Conversation
          connection={connection}
          lastChatterActiveTime={Date.now()}
          chatter={chatter}
          conversationId={selectedMessageId}
        />
      )}
    </div>
  );
}

export default MessagesPage;
