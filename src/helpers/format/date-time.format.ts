import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Timestamp = number | string | Date;

export const formatPostTime = (timestamp: Timestamp): string => {
  const now = dayjs();
  const postTime = dayjs(timestamp);

  if (!postTime.isValid()) {
    throw new Error("Invalid timestamp");
  }

  const diffSeconds = now.diff(postTime, "second");
  const diffMinutes = now.diff(postTime, "minute");
  const diffHours = now.diff(postTime, "hour");
  const diffDays = now.diff(postTime, "day");
  const diffWeeks = now.diff(postTime, "week");

  if (diffSeconds < 10) {
    return "Just now";
  } else if (diffMinutes < 1) {
    return `${diffSeconds} s`;
  } else if (diffHours < 1) {
    return `${diffMinutes} m`;
  } else if (diffDays < 1) {
    return `${diffHours} h`;
  } else if (diffWeeks < 1) {
    return `${diffDays} d`;
  } else if (diffDays < 30) {
    return `${diffWeeks} w`;
  } else {
    return postTime.format("YYYY.MM.DD");
  }
};

export const getActiveTime = (timestamp: Timestamp): string => {
  const now = dayjs();
  const postTime = dayjs(timestamp);

  if (!postTime.isValid()) {
    throw new Error("Invalid timestamp");
  }

  const diffSeconds = now.diff(postTime, "second");
  const diffMinutes = now.diff(postTime, "minute");
  const diffHours = now.diff(postTime, "hour");
  const diffDays = now.diff(postTime, "day");
  const diffWeeks = now.diff(postTime, "week");

  if (diffSeconds < 10) {
    return "Active now";
  } else if (diffMinutes < 1) {
    return `Last active ${diffSeconds} seconds ago`;
  } else if (diffHours < 1) {
    return `Last active ${diffMinutes} minutes ago`;
  } else if (diffDays < 1) {
    return `Last active ${diffHours} hours ago`;
  } else if (diffWeeks < 1) {
    return `Last active ${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `Last active ${diffWeeks} weeks ago`;
  } else {
    return `Last active ${postTime.format("YYYY.MM.DD")}`;
  }
};

export const formatMessageDate = (timestamp: Timestamp): string => {
  if (typeof timestamp === "string") {
    timestamp = parseInt(timestamp, 10);
  } else if (timestamp instanceof Date) {
    timestamp = Math.floor(timestamp.getTime() / 1000); // Convert Date to Unix timestamp in seconds
  }
  const date = dayjs(timestamp * 1000); // Convert seconds to milliseconds for dayjs
  if (!date.isValid()) {
    throw new Error("Invalid timestamp");
  }
  return date.format("DD MMMM YYYY HH:mm");
};
