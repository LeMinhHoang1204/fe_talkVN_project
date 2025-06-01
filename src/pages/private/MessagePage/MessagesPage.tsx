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
import { WEB_SOCKET_EVENT } from "../../../helpers/constants/websocket-event.constant";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  UserDTO
} from "../../../types/data.type";
import Conversation from "../components/Conversation";

type ConversationProps = {
  conversationId: string;
  chatter: UserDTO[];
  lastChatterActiveTime: number;
  connection: HubConnection | null;
};

function MessagesPage({
  conversationId,
}: ConversationProps) {
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

  return (
    <div className="flex flex-row w-300px h-full bg-[#2B2D31]">
      <div className="flex flex-col md:w-[310px] h-full overflow-auto">
        {/* <div className="flex justify-end items-start px-4 h-60px border-b-[2px] border-black/50 w-full"> */}
          <div className="box-border flex items-center justify-between h-[70px] px-4 py-3 border-b-[2px] border-black/50">

              <span className="font-bold text-white flex justify-center items-center w-full">groupName</span>
          </div>


        {/* Search */}
        <div className="w-full h-auto">
            <div className="p-4 mt-[2px] mb-[2px] ml-[8px] mr-[2px] border-b border-[#F5F5F5]/40">
                <span className="flex items-center gap-2 bg-[#2B2D31]">
                    {/* Search Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M19.25 19.25L15.2625 15.2625M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03325 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03325 6.03325 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03325 17.4167 10.0833Z" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input
                        type="text"
                        className="w-full h-auto bg-[#2B2D31] text-white placeholder-[#80848E] px-2 py-2 focus:outline-none"
                        placeholder="Nhập @username để tìm"
                        // className="px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring w-full"
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
                </span>
            </div>
        </div>

        {/* <div className="flex flex-row justify-between px-4 pt-8">
          <div className="flex flex-col gap-2 px-4 pt-6"> */}
            {/* <div className="flex flex-row justify-between items-center">
              <UserNameDisplay
                id={userInfo.userId}
                className="text-blue-400"
                username={`@${userInfo.username}`}
              />
            </div> */}

            {/* 🔍 Input tìm và tạo chat mới */}
            {/* Search Icon */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M19.25 19.25L15.2625 15.2625M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03325 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03325 6.03325 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03325 17.4167 10.0833Z" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
          </div> */}

          {/* <UserNameDisplay
            id={userInfo.userId}
            className="text-blue-400"
            username={`@${userInfo.username}`}
          />
          <button>
            <OpenSendNewMessageOutlineIcon />
          </button> */}
        {/* </div> */}
      <div className="flex flex-row px-4 py-2 overflow-y-auto text-[#80848E]">
        <div className="font-bold px-4 pt-2">{autoCaplock('Channels')}</div>
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

        <div className="flex flex-row px-4 py-2 overflow-y-auto text-[#80848E]">
          <div className="font-bold px-4 pt-2">{autoCaplock('Video channel')}</div>
        </div>

        <button
          onClick={() => {
            const videoCallUrl = `/video/${conversationId}`;
            window.open(videoCallUrl, "_blank", "width=800,height=600");
            connection?.invoke(WEB_SOCKET_EVENT.START_CALL, conversationId);
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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" className="mr-2">
              <path d="M17.2848 4.59186C18.984 6.29158 19.9386 8.5966 19.9386 11C19.9386 13.4034 18.984 15.7084 17.2848 17.4082M14.0852 7.7914C14.9348 8.64126 15.4121 9.79377 15.4121 10.9955C15.4121 12.1972 14.9348 13.3497 14.0852 14.1996M9.97025 4.65531L5.43832 8.28085H1.81277V13.7192H5.43832L9.97025 17.3447V4.65531Z" 
              stroke="#F5F5F5" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            Video channel 1
          </div>


          {/* <div
            className={twMerge(
              "text-sm flex flex-row gap-1",
              !messageItemData.isRead && "font-semibold text-gray-900"
            )}
          >
            {messageItemData.fromMe && (
              <div
                className={twMerge(
                  "text-gray-400",
                  !messageItemData.isRead && "text-gray-900 font-semibold"
                )}
              >
                You:{" "}
              </div>
            )}
            <div
              className={twMerge(
                !messageItemData.isRead && "text-gray-900 font-semibold"
              )}
            >
              {messageItemData.latestMessage}
            </div>
            <div
              className={twMerge(
                "text-gray-500 ml-2 text-sm text-nowrap",
                !messageItemData.isRead && "text-gray-900 font-semibold"
              )}
            >
              • {formatPostTime(messageItemData.time)}
            </div>
          </div> */}
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
