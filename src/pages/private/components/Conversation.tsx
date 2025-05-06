import { HubConnection } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { InfoFillIcon } from "../../../components/icons/InfoFillIcon";
import { PhoneCallOutlineIcon } from "../../../components/icons/PhoneCallOutlineIcon";
import { VideoCallOutlineIcon } from "../../../components/icons/VideoCallOutlineIcon";
import ImageWithFallback from "../../../components/ImageWithFallback";
import { Modal } from "../../../components/Modal";
import {
  useGetConversationDetailQuery,
  useLazyGetConversationInformationQuery,
} from "../../../data/conversation/conversation.api";
import { MessageRES } from "../../../data/conversation/conversation.res";
import { GlobalState } from "../../../data/global/global.slice";
import { WEB_SOCKET_EVENT } from "../../../helpers/constants/websocket-event.constant";
import { getActiveTime } from "../../../helpers/format/date-time.format";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  ConversationDTO,
  ConversationInformationDTO,
  UserDTO,
} from "../../../types/data.type";
import ChatInput from "./ChatInput";
import ConversationInfoExpanded from "./ConversationInfoExpanded";
import Message from "./Message";

type ConversationProps = {
  conversationId: string;
  chatter: UserDTO[];
  lastChatterActiveTime: number;
  connection: HubConnection | null;
};

function Conversation({
  chatter,
  lastChatterActiveTime,
  conversationId,
  connection,
}: ConversationProps) {
  const { userInfo }: GlobalState = useAppSelector((state) => state.global);

  const [conversationData, setConversationData] = useState<ConversationDTO[]>([]);

  const [isShowConversationInfoExpanded, setIsShowConversationInfoExpanded] = useState<boolean>(false);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { data: CONVERSATION_DATA_QUERY } = useGetConversationDetailQuery({
    conversationId,
    messagePageIndex: 1,
    messagePageSize: 100,
  }, {
    refetchOnMountOrArgChange: true,
  });

  // query conversation data
  useEffect(() => {
    setConversationData(CONVERSATION_DATA_QUERY?.data || []);
  }, [conversationId, CONVERSATION_DATA_QUERY?.data]);
  
  // Handle send message
  const handleSendMessage = useCallback(
    (newMessage: MessageRES) => {
      setConversationData((prev) => {
        const exists = prev.some(msg => msg.message.messageId === newMessage.id);
        if (exists) return prev;
      
        return [...prev, {
          conversationId: newMessage.conversationId,
          senderId: userInfo.userId,
          message: {
            messageId: newMessage.id,
            content: newMessage.messageText,
            time: newMessage.createdOn,
          },
        }];
      });

    },
    [userInfo.userId]
  );

  // Handle receive message
  const handleReceiveMessage = useCallback(
    (newMessage: MessageRES) => {
      setConversationData((prev) => {
        const exists = prev.some(msg => msg.message.messageId === newMessage.id);
        if (exists) return prev;
      
        return [...prev, {
          conversationId: newMessage.conversationId,
          senderId: newMessage.senderId,
          message: {
            messageId: newMessage.id,
            content: newMessage.messageText,
            time: newMessage.createdOn,
          },
        }];
      });
    },
    [chatter, conversationId]
  );

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData]);

  // handle read message
  const [getConversationInformation] = useLazyGetConversationInformationQuery();

  useEffect(() => {
    connection?.on(WEB_SOCKET_EVENT.NEW_MESSAGE, (message: MessageRES) => {
      if (chatter.some((user) => user.id === message.senderId)) {
        handleReceiveMessage(message);
      } else if (message.senderId === userInfo.userId) {
        handleSendMessage(message);
      }
      
    });
    connection?.on(WEB_SOCKET_EVENT.RECEIVE_CALL, (conversationId: string) => {
      getConversationInformation(conversationId)
        .unwrap()
        .then((res) => {
          setVideoCallInfo(res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    });

    return () => {
      connection?.off(WEB_SOCKET_EVENT.NEW_MESSAGE, handleReceiveMessage);
    };
  }, [
    chatter,
    connection,
    getConversationInformation,
    handleReceiveMessage,
    handleSendMessage,
  ]);

  const [videoCallInfo, setVideoCallInfo] =
    useState<ConversationInformationDTO | null>(null);


  return (
    <div className="w-full h-full flex flex-row bg-[#313338] text-white">
      <div className="w-full h-full flex flex-col">
        {/* Conversation Header */}
        <div className="flex flex-row justify-between py-3 px-4 border-b border-[#000000]/50 text-white">
          <div className="flex flex-row gap-2 pl-4">
            {/* <ImageWithFallback
              className="h-12 w-12 rounded-full"
              alt="avatar"
              src={chatter[0].profileImage.url}
            /> */}
            <div className="flex flex-col justify-center">
              <div>
              {chatter.map((userDisplayName, index) => (
              <span key={index}>
                {userDisplayName.userDisplayName}
                {index < chatter.length - 1 && ", "}
              </span>
            ))}
            </div>
              <span className="text-sm text-gray-400">
                {getActiveTime(lastChatterActiveTime)}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <button onClick={() => {}}>
              <PhoneCallOutlineIcon />
            </button>
            <button
              onClick={() => {
                const videoCallUrl = `/video/${conversationId}`;
                window.open(videoCallUrl, "_blank", "width=800,height=600");
                connection?.invoke(WEB_SOCKET_EVENT.START_CALL, conversationId);
              }}
            >
              <VideoCallOutlineIcon />
            </button>

            <button
              onClick={() => {
                setIsShowConversationInfoExpanded((prev) => !prev);
              }}
            >
              <InfoFillIcon className="h-6 w-6 overflow-visible" />
            </button>
          </div>
        </div>

        {/* Conversation Messages */}
        <div className="h-full overflow-y-auto flex flex-col justify-end">
          <div className="px-4 overflow-y-auto flex flex-col">
            {conversationData.map((messageItem, index) => (
              <Message
                onlyOneMessageInGroup={
                  (index === 0 ||
                    messageItem.senderId !==
                      conversationData[index - 1].senderId) &&
                  (index === conversationData.length - 1 ||
                    messageItem.senderId !==
                      conversationData[index + 1].senderId)
                }
                senderAvatarUrl={chatter[0].profileImage.url}
                chatter={chatter.find(user => user.id === messageItem.senderId)?.userDisplayName ||
                  (messageItem.senderId === userInfo.userId ? userInfo.username : "Unknown")
                }
                isFirst={
                  (index === 0 ||
                    messageItem.senderId !==
                      conversationData[index - 1].senderId) &&
                  index < conversationData.length - 1 &&
                  messageItem.senderId === conversationData[index + 1].senderId
                }
                isLast={
                  (index === conversationData.length - 1 ||
                    messageItem.senderId !==
                      conversationData[index + 1].senderId) &&
                  index > 0 &&
                  messageItem.senderId === conversationData[index - 1].senderId
                }
                key={messageItem.message.messageId}
                message={messageItem.message.content}
                isFromSender={messageItem.senderId !== userInfo.userId}
                time={messageItem.message.time}
              />
            ))}
            <div ref={lastMessageRef}></div>
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput conversationId={conversationId}  />

        {/* <Modal
          open={videoCallInfo !== null}
          onClose={() => setVideoCallInfo(null)}
          okText={
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setVideoCallInfo(null);
                window.open(
                  `/video/${videoCallInfo?.conversationId}`,
                  "_blank",
                  "width=800,height=600"
                );
              }}

            >
              Accept
            </button>
          }
        ></Modal> */}
        <Modal
          hideXIcon
          className="w-96 h-96"
          isOpen={videoCallInfo !== null}
          onClose={() => {
            setVideoCallInfo(null);
          }}
          content={
            <div className="flex flex-col justify-center items-center bg-white shadow-lg py-8 px-4 rounded-3xl">
              <ImageWithFallback
                src={videoCallInfo?.chatter[0].profileImage.url || ""}
                alt="avatar"
                className="h-24 w-24 rounded-full"
              />
              <div className="text-black text-lg font-medium mt-4">
                {videoCallInfo?.chatter[0].userDisplayName} is calling you!
              </div>
              <p className="text-black">Do you want to join the video call?</p>
              <div className="flex gap-4 mt-8">
                <button
                  className="bg-red-600 font-medium text-white px-6 py-3 rounded-xl"
                  onClick={() => {
                    setVideoCallInfo(null);
                  }}
                >
                  Decline
                </button>

                <button
                  className="bg-green-700 font-medium text-white px-6 py-3 rounded-xl"
                  onClick={() => {
                    setVideoCallInfo(null);
                    window.open(
                      `/video/${videoCallInfo?.conversationId}`,
                      "_blank",
                      "width=800,height=600"
                    );
                  }}
                >
                  Accept
                </button>
              </div>
            </div>
          }
        />
      </div>
      <ConversationInfoExpanded isShow={isShowConversationInfoExpanded} />
    </div>
  );
}

export default Conversation;
