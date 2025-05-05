import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import ImageWithFallback from "../../../components/ImageWithFallback";
import { GlobalState } from "../../../data/global/global.slice";
import { formatPostTime } from "../../../helpers/format/date-time.format";
import { formatMessageDate } from "../../../helpers/format/date-time.format";
import { useAppSelector } from "../../../hooks/reduxHooks";


type MessageProps = {
  message: string;
  time: number;
  isFirst: boolean;
  isLast: boolean;
  isFromSender: boolean;
  senderAvatarUrl: string;
  onlyOneMessageInGroup: boolean;
  chatter: string;
};
function Message({
  message,
  time,
  isFirst,
  isLast,
  isFromSender,
  senderAvatarUrl,
  onlyOneMessageInGroup,
  chatter,
}: MessageProps) {
  const isDisplaySenderAvatar = useMemo(
    () => isFromSender && (isFirst || onlyOneMessageInGroup),
    [isFromSender, isFirst, onlyOneMessageInGroup]
  );

  const isDisplayReceiverAvatar = useMemo(
    () => !isFromSender && (isFirst || onlyOneMessageInGroup),
    [isFromSender, isFirst, onlyOneMessageInGroup]
  );

  const { userInfo }: GlobalState = useAppSelector((state) => state.global);

  return (
    <div
      className={twMerge(
        isFromSender ? "justify-start" : "justify-end",
        "w-full",
        "flex flex-row items-center gap-1"
      )}
    >
      <div>
        {/* Sender image */}
        <ImageWithFallback
          className={twMerge(
            "h-8 w-8 rounded-full",
            !isDisplaySenderAvatar && "opacity-0"
          )}
          src={senderAvatarUrl}
          alt="sender-avatar"
        />
      </div>
           
      
      <div
        className={twMerge(
          "w-max relative px-2 py-1",
          "text-white/90",
          !isFromSender ? "flex flex-col items-end" : "flex flex-col item-start", 
          // "rounded-3xl",
          // isFromSender && "bg-gray-200",
          // !isFromSender && "bg-blue-500 text-white",
          // isFirst && isFromSender && "rounded-bl-md",
          // isLast && isFromSender && "rounded-tl-md",
          // !isFirst && !isLast && isFromSender && "rounded-l-md",
          // isFirst && !isFromSender && "rounded-br-md",
          // isLast && !isFromSender && "rounded-tr-md",
          // !isFirst && !isLast && !isFromSender && "rounded-r-md",
          // onlyOneMessageInGroup && "rounded-3xl",
          isFirst && "mt-2",
          isLast && "mb-2",
          onlyOneMessageInGroup && "my-2"
        )}
      >

        {(isFirst || onlyOneMessageInGroup) &&
        <div>
          <span className="text-bold font-bold text-white mb-1 mr-2">{chatter}</span>
          <span className="text-sm text-[#80848E]">{formatMessageDate(time)}</span>
        </div>}
          
          
          {/* Message text */}
          
        <div className="">{message}</div>
        
        {/* Tooltip for time */}
        {/* <span
          className={twMerge(
            "absolute hidden group-hover:flex -bottom-5 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-lg"
          )}
        >
          {formatPostTime(time)}
        </span> */}
      </div>
      

      
    </div>
  );
}

export default Message;
