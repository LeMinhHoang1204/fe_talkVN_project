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
import Home from "./pages/private/Home/Home";
import ChannelSidebar from "./pages/private/Home/LeftSideBar";
import SideBar from "./pages/private/Home/SideBar";

function AppLayout() {
  return (
    <div className="flex">
      <div className="w-[6%] bg-[#18092f]">
        <SideBar />
      </div>
      <div className="w-[18%]">
        <ChannelSidebar />
      </div>
      <div className="flex-2 bg-gray-100"> {/* Nội dung chính */}</div>
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
