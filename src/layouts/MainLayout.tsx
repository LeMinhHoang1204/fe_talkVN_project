import { Outlet } from "react-router-dom";
import AddPostModal from "../components/AddPostModal";
import { RootState } from "../data";
import { GlobalState } from "../data/global/global.slice";
import { useAppSelector } from "../hooks/reduxHooks";
import { EXPANDED_CONTENT_TYPE } from "../types/side-bar.type";
import SideBar from "./components/SideBar";
import SideBarExpandedContent from "./components/SideBarExpandedContent";

function MainLayout() {
  const { sideBarExpandedContent }: GlobalState = useAppSelector(
    (state: RootState) => state.global
  );

  const isSidebarExpanded =
    sideBarExpandedContent === EXPANDED_CONTENT_TYPE.MESSAGES ||
    sideBarExpandedContent === EXPANDED_CONTENT_TYPE.PROFILE;

  return (
    <div className="flex flex-row flex-start h-full">
      <div
        className="relative transition-all w-24 h-full">
        {/* <div className="w-[6%] bg-[#18092f]"> */}
        <SideBar />
        {/* </div>{" "} */}
        <SideBarExpandedContent />
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
      <AddPostModal />
    </div>
  );
}

export default MainLayout;
