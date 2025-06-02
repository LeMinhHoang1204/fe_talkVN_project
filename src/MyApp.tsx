import ChannelSidebar from "./pages/private/Home/ChannelSideBar";
import RightSidebarGrChat from "./pages/private/Home/RightSidebarGrChat";
import TopBarChannel from "./pages/private/Home/TopBarGrChat";
import WelcomePage from "./pages/private/Home/WelcomePage";
import { useGetGroupListQuery } from "./data/group/group.api";

function AppLayout() {
  const { data: DATA_GROUP } = useGetGroupListQuery();
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <div className="w-[6%] bg-[#18092f]">
        <SideBar />
      </div> */}
      <div className="w-[20%] bg-[#2b2d31]">
        <ChannelSidebar />
      </div>
      <div className="flex-1 relative bg-gray-100">
        <TopBarChannel />
        <div className="pt-[60px] h-full overflow-y-auto flex justify-center items-center">
          <WelcomePage />
        </div>
      </div>
      <RightSidebarGrChat />
    </div>
  );
}

export default AppLayout;
