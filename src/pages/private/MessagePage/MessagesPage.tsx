import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import MessageItemInList, { MessageItemInListDTO } from "../../../components/MessageItemInList";
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

  const { data: messageListData } = useGetConversationListQuery({
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

  return (
    <div className="flex flex-row w-full h-full">
      <div className="border flex flex-col md:w-[420px] h-full overflow-auto">
        <div className="flex flex-row justify-between px-4 pt-8">
          <div className="flex flex-col gap-2 px-4 pt-6">
            {/* <div className="flex flex-row justify-between items-center">
              <UserNameDisplay
                id={userInfo.userId}
                className="text-blue-400"
                username={`@${userInfo.username}`}
              />
            </div> */}

            {/* 🔍 Input tìm và tạo chat mới */}
            <input
              type="text"
              placeholder="Nhập @username để bắt đầu chat..."
              className="px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring w-full"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // ngăn submit form nếu có
              
                  const rawInput = (e.target as HTMLInputElement).value.trim();
              
                  if (!rawInput) {
                    setSearchResult(null); // 👈 reset để messagesToRender lấy từ messageListData
                    return;
                  }
              
                  // ✨ Bước 1: Tách chuỗi thành mảng username
                  const usernames = rawInput
                    .split(",")                          // tách theo dấu phẩy
                    .map((u) => u.trim().replace(/^@/, "")) // xoá khoảng trắng và dấu @
                    .filter((u) => u.length > 0 && u !== userInfo.username); // bỏ rỗng và chính mình
              
                  if (usernames.length === 0) {
                    enqueueSnackbar("Không có username hợp lệ", { variant: "warning" });
                    return;
                  }
              
                  try {
                    const result = await refetchConversationList({
                      PageIndex: 1,
                      PageSize: 10,
                      usernames: usernames,
                    }).unwrap();
              
                    setSearchResult(result.data); // gán kết quả vào state mới
                  } catch (err) {
                    console.error("Lỗi tìm kiếm:", err);
                    enqueueSnackbar("Không tìm thấy người dùng", { variant: "error" });
                  }
              
                  (e.target as HTMLInputElement).value = ""; // reset ô input
                }
              }}              
            />
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
