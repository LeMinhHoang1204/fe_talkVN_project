import { Plus } from "lucide-react";
import React, { useState } from "react";

const avatars = [
  { id: 1, imageUrl: "/avatar2.png", groupName: "Group 1" },
  { id: 2, imageUrl: "/avatar3.png", groupName: "Group 2" },
  { id: 3, imageUrl: "/avatar4.png", groupName: "Group 3" },
  { id: 4, imageUrl: "/avatar1.png", groupName: "" },
];

const SideBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen py-4 bg-[#18092f]">
      {/* Top group: logo + avatars */}
      <div
        className="flex flex-col items-center space-y-4"
        style={{ marginTop: "-5px" }}
      >
        {/* Logo web (trên cùng) */}
        <button className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="52"
            height="49"
            viewBox="0 0 52 49"
            fill="none"
          >
            <path
              d="M0.406791 24.1035C0.182126 10.7915 10.793 0 24.1069 0H26.0999C39.4137 0 50.3889 10.7915 50.6136 24.1035C50.8382 37.4155 40.2273 48.207 26.9135 48.207H24.9205C11.6066 48.207 0.631455 37.4155 0.406791 24.1035Z"
              fill="#2C2636"
            />
            <path
              d="M34.3642 16.1581C33.4741 16.3702 31.7354 17.4693 30.2513 18.7805C29.0639 19.8218 28.7365 20.0532 28.1969 20.2074C27.5873 20.381 22.4749 20.3039 22.1102 20.111C21.9582 20.0339 21.3886 19.6 20.8488 19.1469C18.5778 17.2668 16.7116 16.1677 15.7676 16.1581C14.8237 16.1581 14.5286 17.7103 14.6443 22.1839C14.7172 24.7196 14.7007 24.9317 14.502 25.6548C14.3699 26.1562 14.281 26.8407 14.2537 27.6024C14.2347 28.258 14.1934 28.7883 14.1733 28.7883C14.1432 28.7883 13.8104 28.7015 13.4369 28.5858C12.3472 28.2773 12.2792 28.4123 13.3298 28.7883C14.0572 29.0486 14.2903 29.1739 14.3737 29.3571C14.426 29.4825 14.4285 29.6271 14.3889 29.6657C14.3494 29.7042 14.0179 29.6946 13.6556 29.6464C13.0517 29.5596 12.7807 29.5692 12.02 29.7139C11.4796 29.8199 11.7724 29.9163 12.4945 29.8681C12.9059 29.8488 13.5387 29.8585 13.9008 29.897C14.5545 29.9549 14.5547 29.9645 14.6305 30.2923C14.6637 30.4755 14.6767 30.6491 14.647 30.678C14.6174 30.7069 14.2975 30.7937 13.9375 30.8805C13.5773 30.9576 13.2779 31.0637 13.2787 31.1119C13.2795 31.1601 13.3802 31.1793 13.5103 31.1504C14.2405 30.9865 14.6409 30.9094 14.7513 30.9094C14.8216 30.9094 14.9755 31.1022 15.1001 31.3433C15.2246 31.5843 15.4606 31.8832 15.6236 32.0182L15.9188 32.2592H25.5585C30.8602 32.2495 35.2978 32.211 35.4276 32.1628C35.5673 32.1146 35.7835 31.835 35.9879 31.4493C36.1728 31.1022 36.3688 30.813 36.419 30.813C36.4794 30.8226 36.8218 30.8805 37.2045 30.948C38.0002 31.0926 38.1189 30.9865 37.3528 30.813C36.5062 30.6298 36.4659 30.6201 36.463 30.4466C36.4662 30.0417 36.5959 29.9935 38.031 29.9453C39.3055 29.897 39.3955 29.8778 39.1124 29.7621C38.9201 29.6753 38.4373 29.6271 37.7746 29.6271L36.7405 29.6367L36.7654 29.3282C36.7904 29.0197 36.8302 29.0004 38.6868 28.3448C38.8465 28.2869 38.8161 28.2676 38.5244 28.2387C38.3132 28.2194 37.8926 28.2869 37.553 28.393C37.2135 28.5087 36.9238 28.5955 36.9037 28.5955C36.8836 28.5955 36.8248 28.0845 36.7841 27.4578C36.7302 26.6479 36.6303 26.0791 36.4291 25.462C36.1325 24.5461 36.1451 24.7003 36.2717 22.0875C36.3099 21.3741 36.0915 18.5491 35.9366 17.7007C35.7825 16.9004 35.4914 16.3123 35.1578 16.1773C34.8745 16.052 34.8042 16.052 34.3642 16.1581ZM21.3235 23.4759C22.5481 24.0447 23.5141 25.3559 23.6253 26.59C23.6749 27.1492 23.6475 27.3132 23.434 27.747C23.0942 28.4412 22.4714 29.0197 21.6945 29.3957C21.0569 29.6946 21.9968 29.7042 19.7316 29.7042C18.2254 29.7042 17.8116 29.5789 16.9962 28.8654C16.2217 28.1905 15.9246 27.2457 16.1168 26.1369C16.5289 23.7844 19.1373 22.4539 21.3235 23.4759ZM32.1343 23.2541C33.2542 23.5723 34.0482 24.2086 34.5571 25.2113C34.7961 25.6838 34.8294 25.8766 34.8436 26.7154C34.8573 27.5253 34.8209 27.747 34.6456 28.0748C34.3242 28.6629 33.8591 29.0679 33.1318 29.4053C32.5139 29.6849 32.4239 29.7042 31.2792 29.7042C30.2648 29.6946 29.9832 29.6657 29.4979 29.4728C28.7401 29.1932 27.8841 28.4508 27.5211 27.7663C27.2825 27.3132 27.2498 27.1589 27.2808 26.619C27.3866 25.1535 28.5076 23.7458 29.9951 23.2348C30.5043 23.0613 31.4785 23.0709 32.1343 23.2541ZM26.1834 28.8268C26.3472 29.01 26.1616 29.3186 25.763 29.5017C25.4343 29.656 25.2529 29.6174 24.9268 29.3378C24.6722 29.1257 24.6171 28.8365 24.8167 28.7594C25.0959 28.6437 26.0707 28.6919 26.1834 28.8268Z"
              fill="white"
            />
          </svg>
        </button>

        <div
          className="w-12 h-0.5 bg-gray-400 mb-4 rounded"
          style={{ marginTop: "8px" }}
        />

        {/* avatar nhóm */}
        {avatars.slice(0, 3).map((item) => (
          <div className="relative group" key={item.id}>
            <button>
              <img
                src={item.imageUrl}
                alt={`Avatar ${item.id}`}
                className="w-12 h-12 rounded-full object-cover group-hover:rounded-2xl transition-all duration-200"
              />
            </button>
            {/* Tên nhóm */}
            {item.groupName && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 mb-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover:block">
                {item.groupName}
              </div>
            )}
          </div>
        ))}

        <button className="w-12 h-12 bg-[#2E1A47] text-white rounded-full hover:rounded-2xl flex items-center justify-center transition-all duration-200">
          <Plus size={24} />
        </button>
      </div>

      {/* Avatar cá nhân với menu */}
      <div className="relative group">
        <button onClick={handleAvatarClick}>
          <img
            src="/avatar1.png"
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover group-hover:rounded-2xl transition-all duration-200"
          />
        </button>

        {/* <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 mb-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover:block">
    Tên Người Dùng
  </div> */}

        {isDropdownOpen && (
          <div className="absolute top-1/2 left-full -translate-y-[60%] ml-3 bg-[#2C2C2C] text-white border border-[#B5BAC1] rounded z-10 shadow-lg min-w-[140px]">
            <div className="px-4 py-2 text-xs text-[#F5F5F5] font-semibold border-b border-[#B5BAC1]">
              Tuong Vi
            </div>
            <button
              className="block w-full px-4 py-2 text-xs text-left hover:bg-[#1e122d]"
              onClick={() => {
                console.log("Go to My Account");
                // Chuyển hướng nếu cần:
                // router.push("/my-account");
              }}
            >
              My Account
            </button>
            <button
              className="block w-full px-4 py-2 text-xs text-left hover:bg-[#1e122d]"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
