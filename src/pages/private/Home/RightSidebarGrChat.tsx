import React, { useRef, useState } from "react";

export const generateMembers = () => [
  {
    id: 0,
    name: "KeThongTriLoaiBo",
    avatar: "/avatar1.png",
    email: "admin@example.com",
    phone: "111-111-1111",
    isAdmin: true,
  },
  ...Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    name: `Bò ${index + 1}`,
    avatar: `/avatar${(index % 5) + 1}.png`,
    email: `bo${index + 1}@example.com`,
    phone: `123-456-789${index % 10}`,
    isAdmin: false,
  })),
];

// list kênh tĩnh frontend
const channels = [
  "General",
  "Random",
  "Announcements",
  "Tech Talk",
  "Gaming",
  "Music",
];

export interface Member {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

const RightSidebarGrChat: React.FC = () => {
  const members = generateMembers();
  const [hoveredMemberId, setHoveredMemberId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // State popup phân quyền và hạn chế
  const [rolePopupMemberId, setRolePopupMemberId] = useState<number | null>(
    null
  );
  const [restrictPopupMemberId, setRestrictPopupMemberId] = useState<
    number | null
  >(null);

  // State chọn role trong popup phân quyền
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // State hạn chế tin nhắn
  const [restrictAllChannels, setRestrictAllChannels] = useState(false);
  const [restrictedChannel, setRestrictedChannel] = useState<string>("");

  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     // Đóng dropdown khi click ngoài
  //     for (const [id, ref] of dropdownRefs.current.entries()) {
  //       if (ref && !ref.contains(event.target as Node)) {
  //         setOpenDropdownId((prevId) => (prevId === id ? null : prevId));
  //         setRolePopupMemberId(null);
  //         setRestrictPopupMemberId(null);
  //       }
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
    setRolePopupMemberId(null);
    setRestrictPopupMemberId(null);
  };

  // Mở popup phân quyền
  const onClickRole = (memberId: number) => {
    setRolePopupMemberId(memberId);
    setRestrictPopupMemberId(null);
    setOpenDropdownId(null);
    setSelectedRole(null);
  };

  // Mở popup hạn chế tin nhắn
  const onClickRestrict = (memberId: number) => {
    setRestrictPopupMemberId(memberId);
    setRolePopupMemberId(null);
    setOpenDropdownId(null);
    setRestrictAllChannels(false);
    setRestrictedChannel("");
  };

  const renderMemberItem = (member: Member) => (
    <div
      key={member.id}
      className="relative mb-3 group"
      onMouseEnter={() => setHoveredMemberId(member.id)}
      onMouseLeave={() => setHoveredMemberId(null)}
    >
      <div className="flex items-center justify-between p-[4px] group-hover:bg-[#3A3C40] rounded-[4px] transition duration-200 ease-in-out">
        <div className="flex items-center gap-2">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-[#80848E] group-hover:text-[#DBDEE1]">
            {member.name}
          </span>
          {member.isAdmin && <span className="text-yellow-400">👑</span>}
        </div>

        <div
          className="relative group/icon"
          ref={(el) => el && dropdownRefs.current.set(member.id, el)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-gray-400 hover:text-white cursor-pointer"
            onClick={() => toggleDropdown(member.id)}
          >
            <path
              fillRule="evenodd"
              d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover/icon:block">
            Cài đặt
          </div>

          {openDropdownId === member.id && (
            <div className="absolute right-0 top-7 bg-[#1F1F1F] text-white shadow-md rounded w-40 z-20 py-2 border border-gray-700">
              <div
                className="px-4 py-1 hover:bg-[#3A3C40] cursor-pointer text-sm"
                onClick={() => onClickRole(member.id)}
              >
                Phân quyền
              </div>
              <div
                className="px-4 py-1 hover:bg-[#3A3C40] cursor-pointer text-sm"
                onClick={() => onClickRestrict(member.id)}
              >
                Hạn chế tin nhắn
              </div>
            </div>
          )}

          {/* phân quyền  */}
          {rolePopupMemberId === member.id && (
            <div className="absolute z-30 right-full top-0 w-48 bg-[#222] border border-gray-600 rounded p-3 shadow-lg">
              <h3 className="text-white font-semibold mb-2">Chọn phân quyền</h3>
              {["GroupOwner", "Moderator", "Member", "SystemAdmin"].map(
                (role) => (
                  <div key={role} className="mb-1">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`role-${member.id}`}
                        value={role}
                        checked={selectedRole === role}
                        onChange={() => setSelectedRole(role)}
                        className="mr-2"
                      />
                      <span className="text-white">{role}</span>
                    </label>
                  </div>
                )
              )}
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    // TODO: Xử lý phân quyền tại đây
                    console.log(`Phân quyền ${member.id} => ${selectedRole}`);
                    setRolePopupMemberId(null);
                  }}
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-white"
                >
                  OK
                </button>
                <button
                  onClick={() => setRolePopupMemberId(null)}
                  className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 text-white"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* hạn chế tin nhắn  */}
          {restrictPopupMemberId === member.id && (
            <div className="absolute z-30 right-full top-0 w-56 bg-[#222] border border-gray-600 rounded p-3 shadow-lg">
              <h3 className="text-white font-semibold mb-2">
                Hạn chế tin nhắn
              </h3>
              <label className="inline-flex items-center mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={restrictAllChannels}
                  onChange={() => setRestrictAllChannels((prev) => !prev)}
                  className="mr-2"
                />
                <span className="text-white">Hạn chế tất cả các kênh</span>
              </label>
              {!restrictAllChannels && (
                <>
                  <p className="text-white mb-1">Chọn kênh hạn chế:</p>
                  <select
                    className="w-full p-1 rounded bg-[#333] text-white"
                    value={restrictedChannel}
                    onChange={(e) => setRestrictedChannel(e.target.value)}
                  >
                    <option value="">-- Chọn kênh --</option>
                    {channels.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    // TODO: Gửi hạn chế lên server hoặc xử lý ở đây
                    console.log(
                      `Hạn chế ${member.id}:`,
                      restrictAllChannels ? "Tất cả" : restrictedChannel
                    );
                    setRestrictPopupMemberId(null);
                  }}
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-white"
                >
                  OK
                </button>
                <button
                  onClick={() => setRestrictPopupMemberId(null)}
                  className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 text-white"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {hoveredMemberId === member.id && (
        <div className="absolute left-0 top-full mt-2 w-full z-10 bg-[#1a1a1d] text-white p-2 rounded shadow-lg">
          <h4 className="font-semibold text-sm mb-1">{member.name}</h4>
          <p className="text-xs">Email: {member.email}</p>
          <p className="text-xs">Phone: {member.phone}</p>
        </div>
      )}
    </div>
  );

  const admins = members.filter((m) => m.isAdmin);
  const regularMembers = members.filter((m) => !m.isAdmin);

  return (
    <div
      className="bg-[#2B2D31] text-white p-4 custom-scrollbar"
      style={{
        width: "350px",
        height: "calc(100vh - 60px)",
        position: "fixed",
        top: "60px",
        right: 0,
        overflowY: "scroll",
        flexShrink: 0,
      }}
    >
      <p className="text-xs font-semibold text-gray-400 mb-2">
        ADMIN - {admins.length}
      </p>
      {admins.map(renderMemberItem)}

      <p className="text-xs font-semibold text-gray-400 mb-2 mt-4">
        MEMBER - {regularMembers.length}
      </p>
      {regularMembers.map(renderMemberItem)}
    </div>
  );
};

export default RightSidebarGrChat;
