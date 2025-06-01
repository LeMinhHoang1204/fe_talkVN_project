import ChannelSidebar from "./pages/private/Home/ChannelSideBar.tsx";
import MessagesPage from "./pages/private/Home/ConversatioinPage.tsx";
import SideBar from "./pages/private/Home/SideBar.tsx";

function MyApp() {
  return (
    <div className="flex">
      <div className="w-[5%] bg-[#18092f]"> {/* group bar */}  <SideBar /></div>
      <div className="w-[18%]">
          <ChannelSidebar />
      </div>
      <div className="flex-2 bg-gray-100"> {/* Nội dung chính */} <MessagesPage /> </div>
    </div>
  );
}

export default MyApp;