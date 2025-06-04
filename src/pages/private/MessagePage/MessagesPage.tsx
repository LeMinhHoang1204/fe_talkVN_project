import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageItemInList, {
  MessageItemInListDTO,
} from "../../../components/MessageItemInList";
import {
  GET_CONVERSATION_LIST_PAGE_SIZE,
  useCreateConversationByUsernameMutation,
  useGetConversationListQuery,
  useLazyGetConversationListByUsernameQuery,
} from "../../../data/conversation/conversation.api";
import { GlobalState } from "../../../data/global/global.slice";
import { useCreateInvitationMutation } from "../../../data/group/group.api.ts"; // adjust path as needed
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

  const { data: messageListData, refetch, isLoading, error } = useGetConversationListQuery({
    PageIndex: 1,
    PageSize: GET_CONVERSATION_LIST_PAGE_SIZE,
    groupId: isGroupChat ? groupId : undefined, // Truyền groupId
    endpoint: isGroupChat ? `/Group/${groupId}` : undefined,
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

  const [inviteLink, setInviteLink] = useState("");
  const [createInvitation, { isLoading: invitationLoading }] = useCreateInvitationMutation();

  const textChannels = (messagesToRender ?? []).filter(
    (item) => item.textChatType === "GroupChat"
  );

  const videoChannels = (messagesToRender ?? []).filter(
    (item) => item.textChatType === "GroupCall"
  );

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

  const groupCalls = (messageListData?.data ?? []).filter(chat => chat.textChatType === "GroupCall");
  const groupChats = (messageListData?.data ?? []).filter(chat => chat.textChatType === "GroupChat");
  
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Handler for clicking "Thêm thành viên"
  const handleAddMemberClick = async () => {
    if (!groupId) {
      console.log("Không tìm thấy groupId.");
      setInviteLink("Không tìm thấy groupId.");
      return;
    }
    try {
      const result = await createInvitation({ groupId }).unwrap();
      setInviteLink(result.result.invitationUrl);
      console.log(result.result.invitationUrl);
      setShowInviteModal(true);
    } catch (error) {
      setInviteLink("Có lỗi xảy ra khi tạo link mời.");
    }
  };

  const [search, setSearch] = useState("");
  type SearchUser = { id: string; username: string };
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (!search) {
      setUsers([]);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        console.log('dang goi api search');
        const res = await axios.get("/api/Group/search-by-usernames", {
          params: {
            usernames: search,
            PageIndex: 1,
            PageSize: 10,
          },
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Send invite handler
  const handleInvite = async (targetUserId: string) => {
    try {
      console.log('dang goi api');
      await axios.post("/api/Group/send-invite", {
        groupId,
        targetUserId,
        senderUserId: userInfo.userId,
      });
      alert("Invite sent!");
    } catch (err) {
      alert("Failed to send invite");
    }
  };

  return (
    <div className="flex flex-row w-300px h-full bg-[#2B2D31]">
      <div className="flex flex-col md:w-[310px] h-full overflow-auto">
        <div className="box-border flex items-center justify-between h-[70px] px-4 py-3 border-b-[2px] border-black/50">
          <span className="font-bold text-white flex justify-start items-center w-full pl-4 text-lg">
            {isGroupChat ? "Group Chat" : "Messages"}
          </span>
          <button
            onClick={handleAddMemberClick}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            aria-label="Thêm thành viên"
          >
            <svg
              className=""
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M17.2848 4.59186C18.984 6.29158 19.9386 8.5966 19.9386 11C19.9386 13.4034 18.984 15.7084 17.2848 17.4082M14.0852 7.7914C14.9348 8.64126 15.4121 9.79377 15.4121 10.9955C15.4121 12.1972 14.9348 13.3497 14.0852 14.1996M9.97025 4.65531L5.43832 8.28085H1.81277V13.7192H5.43832L9.97025 17.3447V4.65531Z"
                stroke="#F5F5F5"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Container chính của pop-up */}
          <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-lg">

            {/* Dòng ngang chứa nút đóng ở góc phải */}
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Đóng"
              >
                {/* Bạn có thể thay bằng icon "X" SVG nếu muốn */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Header (Tiêu đề + kênh) */}
            {/* Them thanh vien vao group */}
            <div className="px-6 py-2 border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold">
                Mời bạn bè vào nhóm
              </h2>
              <p className="text-gray-400 text-sm mt-1"># chào-mừng-và-nội-quy</p>
            </div>

            {/* Input tìm kiếm bạn bè */}
            <div className="px-6 py-4">
              <input
                id="searchInput"
                type="text"
                placeholder="Tìm kiếm bạn bè"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Danh sách bạn bè (sẽ render động) */}
            <div id="friendsContainer" className="max-h-64 overflow-y-auto px-6 space-y-4">
              {/* Ta sẽ "mount" danh sách bạn bè vào đây bằng JS (xem phần script bên dưới) */}
              {loading && <div>Đang tải danh sách bạn bè...</div>}
              {users.map(user => (
                <div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span>{user.username}</span>
                  <button
                    onClick={() => handleInvite(user.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mời
                  </button>
                </div>
              ))}
            </div>

            {/* Phần gửi link mời */}
            <div className="px-6 py-4 border-t border-gray-700">
              <label className="block text-gray-400 text-sm mb-2">
                Gửi lời mời cho bạn bè
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="inviteLinkInput"
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
                <button
                  id="copyInviteBtn"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Sao chép
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Link mới của bạn sẽ hết hạn sau 7 ngày.{" "}
              </p>
            </div>
          </div>
        </div>
      )}

        {/* <div className="w-full h-auto">
          <div className="flex flex-row justify-between px-2"> */}
            {/* <div className="flex flex-col gap-2 px-2 py-2">
              <div className="flex flex-row justify-between items-center">
                <UserNameDisplay
                  id={userInfo.userId}
                  className="text-blue-400"
                  username={`@${userInfo.username}`}
                />
              </div> */}

              {/* Tim chat */}
              {/* <input
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
            </div> */}
          {/* </div>
        </div> */}

        <div className="flex flex-row pl-5 pr-2 py-2 overflow-y-auto text-[#80848E]">
          <div className="w-full font-bold pL-4 py-2 border-b-[2px] border-[#80848E] justify-between items-center ">{autoCaplock("Channels")}</div>
        </div>

        {/* A message is a conversation */}
        <div className="flex flex-col mx-3">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error loading chats</div>}

          {/* Text Channel Section */}
          <div className="flex flex-row px-4 overflow-y-auto text-[#80848E] justify-between items-center">
            <div className="font-bold px-4 pt-2">{autoCaplock("Text channel")}</div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                <path d="M24 10V38M10 24H38" stroke="#B5BAC1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          {textChannels.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center">
              No text channels yet.
            </div>
          )}
          {textChannels.map((message) => (
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

          {/* Video Channel Section */}
          <div className="flex flex-row px-4 py-2 overflow-y-auto text-[#80848E] justify-between items-center">
            <div className="font-bold px-4 pt-2">{autoCaplock("Video channel")}</div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                <path d="M24 10V38M10 24H38" stroke="#B5BAC1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          {videoChannels.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center">
              No video channels yet.
            </div>
          )}
          {videoChannels.map((message) => (
            <button
              key={message.messageId}
              onClick={() => {
                const videoCallUrl = `/video/${message.messageId}`;
                window.open(videoCallUrl, "_blank", "width=800,height=600");
                connection?.invoke(
                  WEB_SOCKET_EVENT.START_CALL,
                  message.messageId
                );
              }}
            >
              <div className="flex-col">
                <div
                  className="text-[#80848E] group flex items-center relative mt-2 ml-[10px] p-[2px] cursor-pointer hover:bg-[#3A3C40] hover:text-[#DBDEE1] rounded-[4px] transition duration-200 ease-in-out"
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
                      strokeOpacity="0.4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {message.name}
                </div>
              </div>
            </button>
          ))}
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
