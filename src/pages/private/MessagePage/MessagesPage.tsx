import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import MessageItemInList from "../../../components/MessageItemInList";
import {
  GET_CONVERSATION_LIST_PAGE_SIZE,
  useCreateConversationByUsernameMutation,
  useGetConversationListQuery,
} from "../../../data/conversation/conversation.api";
import { GlobalState } from "../../../data/global/global.slice";
import { socketBaseUrl } from "../../../helpers/constants/configs.constant";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { UserDTO } from "../../../types/data.type";
import Conversation from "../components/Conversation";

function MessagesPage() {
  const { userInfo }: GlobalState = useAppSelector((state) => state.global);

  const { data: messageListData } = useGetConversationListQuery({
    PageIndex: 0,
    PageSize: GET_CONVERSATION_LIST_PAGE_SIZE,
  });

  const [chatter, setChatter] = useState<UserDTO>();

  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    messageListData?.data?.[0]?.messageId || ""
  );
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const [createConversation] = useCreateConversationByUsernameMutation();

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
            {/* 🔍 Input tìm và tạo chat mới */}
            <input
              type="text"
              placeholder="Nhập @username để bắt đầu chat..."
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring w-full"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const input = (e.target as HTMLInputElement).value
                    .trim()
                    .replace(/^@/, "");

                  if (!input || input === userInfo.username) return;

                  try {
                    const res = await createConversation({
                      username: input,
                    }).unwrap(); // gọi mutation từ RTK Query
                    setSelectedMessageId(res.id);
                    setChatter(res.chatterInfo.chatter);
                  } catch (err: unknown) {
                    console.error("Lỗi khi tạo đoạn chat:", err);
                    alert("Không tìm thấy người dùng hoặc lỗi tạo đoạn chat.");
                  }

                  (e.target as HTMLInputElement).value = ""; // xoá input sau khi tạo
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
        <div className="flex flex-col mx-3">
          {messageListData?.data.map((message) => (
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
          {messageListData?.data.length === 0 && (
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
