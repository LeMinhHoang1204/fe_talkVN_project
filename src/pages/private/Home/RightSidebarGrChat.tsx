import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type ConversationInfoExpandedProps = {
  isShow: boolean;
};

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

function ConversationInfoExpanded({ isShow }: ConversationInfoExpandedProps) {
  const members = generateMembers();
  const [hoveredMemberId, setHoveredMemberId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [rolePopupMemberId, setRolePopupMemberId] = useState<number | null>(
    null
  );
  const [restrictPopupMemberId, setRestrictPopupMemberId] = useState<
    number | null
  >(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [restrictAllChannels, setRestrictAllChannels] = useState(false);
  const [restrictedChannels, setRestrictedChannels] = useState<string[]>([]);

  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
    setRolePopupMemberId(null);
    setRestrictPopupMemberId(null);
  };

  const onClickRole = (memberId: number) => {
    setRolePopupMemberId(memberId);
    setRestrictPopupMemberId(null);
    setOpenDropdownId(null);
    setSelectedRole(null);
  };

  const onClickRestrict = (memberId: number) => {
    setRestrictPopupMemberId(memberId);
    setRolePopupMemberId(null);
    setOpenDropdownId(null);
    setRestrictAllChannels(false);
    setRestrictedChannels([]);
  };

  const renderMemberItem = (member: Member) => (
    <div
      key={member.id}
      className="relative mb-3 group"
      onMouseEnter={() => setHoveredMemberId(member.id)}
      onMouseLeave={() => setHoveredMemberId(null)}
    >
      <div className="flex items-center justify-between p-3 rounded-md group-hover:bg-[#3b3d43] transition-colors duration-300 ease-in-out cursor-default">
        <div className="flex items-center gap-3">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
          />
          <div>
            <p className="text-white font-medium text-sm tracking-wide">
              {member.name}{" "}
              {member.isAdmin && <span className="text-yellow-400">👑</span>}
            </p>
            <p className="text-gray-400 text-xs select-none">{member.email}</p>
          </div>
        </div>

        <div
          className="relative group/icon"
          ref={(el) => el && dropdownRefs.current.set(member.id, el)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors"
            onClick={() => toggleDropdown(member.id)}
          >
            <path
              fillRule="evenodd"
              d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 px-3 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover/icon:block select-none">
            Cài đặt
          </div>

          {openDropdownId === member.id && (
            <div className="absolute right-0 top-7 bg-[#222222] text-white shadow-lg rounded-md w-44 z-20 py-2 border border-gray-700">
              <div
                className="px-4 py-2 hover:bg-[#3A3C40] cursor-pointer text-sm transition"
                onClick={() => onClickRole(member.id)}
              >
                Phân quyền
              </div>
              <div
                className="px-4 py-2 hover:bg-[#3A3C40] cursor-pointer text-sm transition"
                onClick={() => onClickRestrict(member.id)}
              >
                Hạn chế tin nhắn
              </div>
            </div>
          )}

          {/* phân quyền */}
          {rolePopupMemberId === member.id && (
            <div className="absolute z-30 right-full top-0 w-52 bg-[#252525] border border-gray-600 rounded-md p-4 shadow-xl font-roboto text-white text-sm">
              <p className="mb-2 font-semibold border-b border-gray-700 pb-1">
                Phân quyền thành viên
              </p>
              {["GroupOwner", "Moderator", "Member", "SystemAdmin"].map(
                (role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 mb-2 cursor-pointer hover:text-yellow-400 transition"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="accent-yellow-400"
                    />
                    {role}
                  </label>
                )
              )}
              <button
                className="mt-3 bg-yellow-500 text-black rounded px-3 py-1 hover:bg-yellow-600 transition"
                onClick={() => {
                  alert(
                    `Đã cấp quyền ${selectedRole ?? "(chưa chọn)"} cho ${
                      member.name
                    }`
                  );
                  setRolePopupMemberId(null);
                }}
                disabled={!selectedRole}
              >
                Xác nhận
              </button>
              <button
                className="ml-2 text-gray-400 hover:text-white"
                onClick={() => setRolePopupMemberId(null)}
              >
                Hủy
              </button>
            </div>
          )}

          {/* hạn chế tin nhắn */}
          {restrictPopupMemberId === member.id && (
            <div className="absolute z-30 right-full top-0 w-56 bg-[#252525] border border-gray-600 rounded-md p-4 shadow-xl font-roboto text-white text-sm">
              <p className="mb-3 font-semibold border-b border-gray-700 pb-1">
                Hạn chế tin nhắn
              </p>

              <label className="flex items-center gap-2 mb-3 cursor-pointer hover:text-yellow-400 transition">
                <input
                  type="checkbox"
                  checked={restrictAllChannels}
                  onChange={(e) => {
                    setRestrictAllChannels(e.target.checked);
                    if (e.target.checked) setRestrictedChannels([]);
                  }}
                  className="accent-yellow-400"
                />
                Hạn chế toàn bộ kênh
              </label>

              {!restrictAllChannels && (
                <div className="max-h-28 overflow-y-auto border border-gray-700 rounded p-2">
                  {channels.map((channel) => (
                    <label
                      key={channel}
                      className="flex items-center gap-2 mb-1 cursor-pointer hover:text-yellow-400 transition text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={restrictedChannels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRestrictedChannels((prev) => [...prev, channel]);
                          } else {
                            setRestrictedChannels((prev) =>
                              prev.filter((c) => c !== channel)
                            );
                          }
                        }}
                        className="accent-yellow-400"
                      />
                      #{channel}
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                <button
                  className="bg-yellow-500 text-black rounded px-3 py-1 hover:bg-yellow-600 transition disabled:opacity-50"
                  onClick={() => {
                    alert(
                      `Đã áp hạn chế ${
                        restrictAllChannels
                          ? "toàn bộ kênh"
                          : restrictedChannels.join(", ")
                      } cho ${member.name}`
                    );
                    setRestrictPopupMemberId(null);
                  }}
                  disabled={
                    !restrictAllChannels && restrictedChannels.length === 0
                  }
                >
                  Xác nhận
                </button>
                <button
                  className="text-gray-400 hover:text-white px-3 py-1"
                  onClick={() => setRestrictPopupMemberId(null)}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={twMerge(
        "font-roboto fixed top-0 right-0 h-full w-[28rem] bg-[#181818] text-white shadow-lg overflow-auto p-6 transition-transform duration-300 ease-in-out"
      )}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <h2 className="text-2xl font-semibold mb-6 tracking-wide border-b border-gray-700 pb-3">
        Thành viên
      </h2>

      <div className="flex flex-col">
        {members.map((member) => renderMemberItem(member))}
      </div>
    </div>
  );
}

export default ConversationInfoExpanded;
