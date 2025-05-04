import { HubConnection } from "@microsoft/signalr";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { WEB_SOCKET_EVENT } from "../helpers/constants/websocket-event.constant";
import { formatPostTime } from "../helpers/format/date-time.format";
import { UserDTO } from "../types/data.type";
import ImageWithFallback from "./ImageWithFallback";

export type MessageItemInListDTO = {
  messageId: string;
  latestMessage: string;
  time: number;
  isRead: boolean;
  fromMe: boolean;
  // receiverId: string;
  // userDisplayName: string;
  // userImageUrl: string;
  // receiversId: string[];
  // usersDisplayName: string[];
  receivers: UserDTO[];
};

type MessageItemInListProps = {
  isActive: boolean;
  onCurrentSelectedMessage: (messageId: string) => void;
  setChatter: Dispatch<SetStateAction<UserDTO[] | undefined>>;
  messageItemData: MessageItemInListDTO;
  connection: HubConnection | null;
};

function MessageItemInList({
  onCurrentSelectedMessage,
  isActive,
  setChatter,
  messageItemData,
  connection,
}: MessageItemInListProps) {
  return (
    <button
      onClick={() => {
        onCurrentSelectedMessage(messageItemData.messageId);
        // setChatter({
        //   id: messageItemData.receiversId,
        //   username: messageItemData.usersDisplayName,
        //   usersDisplayName: messageItemData.usersDisplayName,
        //   profileImage: {
        //     key: messageItemData.userImageUrl,
        //     url: messageItemData.userImageUrl,
        //   },
        // });
        setChatter(
          messageItemData.receivers.map((receiver) => ({
            id: receiver.id,
            username: receiver.username,
            userDisplayName: receiver.userDisplayName,
            profileImage: {
              key: receiver.profileImage.key,
              url: receiver.profileImage.url,
            },
          }))
        );
        connection
          ?.invoke(
            WEB_SOCKET_EVENT.JOIN_CONVERSATION_GROUP,
            messageItemData.messageId
          )
          .catch((error) => console.error("Error:", error));
      }}
      className={twMerge(
        "flex flex-row gap-2 w-full py-3 rounded-xl hover:bg-gray-100 text-start",
        isActive && "bg-gray-100"
      )}
    >
      <ImageWithFallback
        className="h-12 w-12 rounded-full"
        src={messageItemData.receivers[0].profileImage.url}
        alt="userImage"
      />
      <div className={twMerge("flex-col flex-nowrap")}>
        <div
          className={twMerge(
            !messageItemData.isRead && "text-gray-900 font-semibold"
          )}
        >
          {/* {messageItemData.userDisplayName} */}
          {messageItemData.receivers.map((userDisplayName, index) => (
            <span key={index}>
              {userDisplayName.userDisplayName}
              {index < messageItemData.receivers.length - 1 && ", "}
            </span>
          ))}
        </div>
        <div
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
        </div>
      </div>
    </button>
  );
}

export default MessageItemInList;
