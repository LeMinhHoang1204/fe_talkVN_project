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
<<<<<<< HEAD
    <div className="flex flex-row w-full h-full bg-[#2B2D31]">
      <div className="w-300px flex flex-col md:w-[420px] h-full overflow-auto">
        <div className="w-full h-60px">
            <div
                className="flex justify-end items-start border-b-[2px] border-black/50"
                style={{
                    padding: "19px 0px",
                }}
            >
                <span className="font-bold text-white flex justify-center items-center w-full">groupName</span>
            </div>
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
=======
    <div className="flex flex-row w-full h-full">
      <div className="border flex flex-col md:w-[420px] h-full overflow-auto">
        <div className="flex flex-row justify-between px-4 pt-8">
          <div className="flex flex-col gap-2 px-4 pt-6">
            <div className="flex flex-row justify-between items-center">
>>>>>>> f23ddc64ffe8c234bcec33391af9a2d7630d96dd
              <UserNameDisplay
                id={userInfo.userId}
                className="text-blue-400"
                username={`@${userInfo.username}`}
              />
            </div>

<<<<<<< HEAD
            {/* 🔍 Input tìm và tạo chat mới */}
            {/* Search Icon */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M19.25 19.25L15.2625 15.2625M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03325 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03325 6.03325 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03325 17.4167 10.0833Z" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
=======
            {/* Tim chat */}
>>>>>>> f23ddc64ffe8c234bcec33391af9a2d7630d96dd
            <input
              type="text"
              placeholder="Nhập @username để bắt đầu chat (mặc định là email)" 
              className="w-[370px] px-4 py-2 text-sm border border-gray-300 rounded-xl shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              onKeyDown={handleUsernameSearch}           
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
          <div className="font-bold px-4">Channels</div>
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
