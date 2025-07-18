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
    <div className="flex flex-row flex-start h-full w-full overflow-hidden">
      <div className="relative transition-all w-24">
        <SideBar />
      </div>
      <div className="w-[calc(100%-6rem)] h-full">
        <Outlet />
      </div>
      <AddPostModal />
    </div>
  );
}

export default MainLayout;
