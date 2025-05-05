// import ChannelSidebar from "./pages/private/Home/LeftSideBar.tsx";
// import SideBar from "./pages/private/Home/SideBar.tsx";

// function MyApp() {
//   return (
//     <div className="flex">
//       <div className="w-[6%] bg-[#18092f]"> {/* group bar */}  <SideBar /></div>
//       <div className="w-[18%]">
//           <ChannelSidebar />
//       </div>
//       <div className="flex-2 bg-gray-100"> {/* Nội dung chính */}</div>
//     </div>
//   );
// }

// export default MyApp;

import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./route/index";
import Home from "./pages/private/Home/Home";
import ChannelSidebar from "./pages/private/Home/LeftSideBar";
import RightSidebarGrChat from "./pages/private/Home/RightSidebarGrChat";
import SideBar from "./pages/private/Home/SideBar";
import TopBarChannel from "./pages/private/Home/TopBarGrChat";
import WelcomePage from "./pages/private/Home/WelcomePage";

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[6%] bg-[#18092f]">
        <SideBar />
      </div>

      <div className="w-[18%] bg-[#2b2d31]">
        <ChannelSidebar />
      </div>

      <div className="flex-1 relative bg-gray-100">
        <TopBarChannel />
        <div className="pt-[60px] h-full overflow-y-auto flex justify-center items-center">
          <WelcomePage />
        </div>{" "}
      </div>

      <RightSidebarGrChat />
    </div>
  );
}

function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group-chat" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MyApp;
