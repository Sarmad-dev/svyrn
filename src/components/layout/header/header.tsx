"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";
import MobileSheet from "../sidebar/mobile-sheet";
import GlobalSearchDropdown from "@/components/global-search";
import NotificationDropdown from "./notification-dropdown";
import ConversationDropdown from "./conversation-dropdown";

const Header = () => {
  return (
    <header className="bg-primary dark:bg-gray-900 text-foreground h-14 flex sm:h-16 items-center justify-center max-sm:px-2">
      <div className="container flex items-center justify-between">
        <MobileSheet />
        <Link href="/home" className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="App Logo"
            width={150}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Center Section: Search Bar (Desktop Only) */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <GlobalSearchDropdown />
        </div>

        {/* Right Section: Icons + DropdownMenu */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center gap-4">
            <ConversationDropdown />
            <NotificationDropdown />
          </div>
          
          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-2">
            <ConversationDropdown />
            <NotificationDropdown />
            <GlobalSearchDropdown />
          </div>
          
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
