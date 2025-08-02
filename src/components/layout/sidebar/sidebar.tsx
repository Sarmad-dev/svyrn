"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link";
import { sidebarLinks } from "@/lib/constants";
import OnlineConnections from "./onlline-connection";

const LeftSideBar = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <aside className={`w-[300px] md:bg-transparent md:shadow-none`}>
      <div
        className={`bg-transparent dark:bg-gray-800 rounded-lg border-2 border-primary w-full overflow-y-auto`}>
        {sidebarLinks.map((link) => (
          <Link
            href={link.route}
            key={link.route}
            className={`w-full flex items-center p-2 border-b border-primary transition-colors h-[60px] ${
              pathname.includes(link.route)
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}>
            <Image
              src={link.icon}
              alt={link.label}
              className="h-12 w-12 mr-2"
            />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
      <OnlineConnections />
    </aside>
  );
};

export default LeftSideBar;
