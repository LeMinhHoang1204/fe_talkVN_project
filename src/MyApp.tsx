import React from "react";
import ChannelSidebar from "./pages/private/Home/LeftSideBar.tsx";

function MyApp() {
  return (
    <div className="flex">
      <div className="w-[6%] bg-[#18092f]"> {/* group bar */}</div>
      <div className="w-[18%]">
          <ChannelSidebar />
      </div>
      <div className="flex-2 bg-gray-100"> {/* Nội dung chính */}</div>
    </div>
  );
}

export default MyApp;