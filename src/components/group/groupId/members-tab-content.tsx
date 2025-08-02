// components/GroupMembers.tsx

import React from "react";
import Image from "next/image";
import { Member, Role } from "@/types/global";

interface GroupMembersProps {
  members: Member[];
}

const roleColors: Record<Role, string> = {
  admin: "bg-red-100 text-red-600",
  moderator: "bg-blue-100 text-blue-600",
  member: "bg-green-100 text-green-600",
};

export default function MembersTabContent({ members }: GroupMembersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {members.map((member, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-transform hover:scale-[1.01]">
          <div className="relative w-14 h-14 rounded-full overflow-hidden">
            <Image
              src={member.user.profilePicture || "/images/user.png"}
              alt={member.user.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {member.user.name}
            </span>
            <span className="text-sm text-gray-500">
              @{member.user.username}
            </span>
            <span
              className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
                roleColors[member.role]
              }`}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
