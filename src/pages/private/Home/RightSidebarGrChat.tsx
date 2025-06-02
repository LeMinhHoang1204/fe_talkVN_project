import React, { useState } from "react";

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

  const admins = members.filter((m) => m.isAdmin);
  const regularMembers = members.filter((m) => !m.isAdmin);

  const renderMemberItem = (member: Member) => (
    <div
      key={member.id}
      className="relative mb-3 cursor-pointer group"
      onMouseEnter={() => setHoveredMemberId(member.id)}
      onMouseLeave={() => setHoveredMemberId(null)}
    >
      <div className="flex items-center gap-2 p-[4px] cursor-pointer group-hover:bg-[#3A3C40] rounded-[4px] transition duration-200 ease-in-out">
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

      {hoveredMemberId === member.id && (
        <div className="absolute left-0 top-full mt-2 w-full z-10 bg-[#1a1a1d] text-white p-2 rounded shadow-lg">
          <h4 className="font-semibold text-sm mb-1">{member.name}</h4>
          <p className="text-xs">Email: {member.email}</p>
          <p className="text-xs">Phone: {member.phone}</p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="bg-[#2B2D31] text-white p-4 custom-scrollbar"
      style={{
        width: "250px",
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
