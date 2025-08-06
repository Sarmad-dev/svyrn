"use client";
import { Bell, Home, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";
import MobileSheet from "../sidebar/mobile-sheet";
import GlobalSearchDropdown from "@/components/global-search";

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

        {/* Center Section: Search Bar (Hidden on Mobile) */}
        <div className="hidden md:block">
          <GlobalSearchDropdown />
        </div>

        {/* Right Section: Icons + DropdownMenu (Large Screens Only) */}
        <div className="flex items-center md:space-x-4">
          <div className="hidden md:flex items-center gap-4">
            <Home className="h-6 w-6" color="white" />
            <MessageCircle className="h-6 w-6" color="white" />
            <Bell className="h-6 w-6" color="white" />
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
