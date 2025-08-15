"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // or use clsx if you don't use cn helper
import { User } from "@/types/global";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HomeContent from "./home-content";
import FollowingContent from "./following-content";
import UserListings from "@/components/marketplace/listings/listings";
import ChatContent from "./chat-content";
import PhotosTab from "./tab-photos";
import VideosTab from "./tab-videos";
import ProfileLeftSide from "@/components/profile/left-side";

const tabItems = [
  { label: "Home", value: "home" },
  { label: "Photos", value: "photos" },
  { label: "Videos", value: "videos" },
  { label: "Following", value: "following" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Chat", value: "chat" },
];

export function ProfileAnimatedTabs({ user }: { user: User }) {
  const [activeTab, setActiveTab] = React.useState("home");
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });

  React.useEffect(() => {
    const current = tabsRef.current.find(
      (ref) => ref?.dataset.value === activeTab
    );
    if (current) {
      const { offsetLeft, offsetWidth } = current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="relative">
        <TabsList className="md:left-[-480px] relative flex items-center mx-auto gap-2 border-b border-gray-300">
          {tabItems.slice(0, 3).map((tab, idx) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-value={tab.value}
              ref={(el: HTMLButtonElement | null): void => {
                tabsRef.current[idx] = el;
              }}
              className={cn(
                "data-[state=active]:bg-transparent data-[state=active]:border-none rounded-none px-4 py-2 text-sm font-medium text-muted-foreground transition-colors"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md border">
                More
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {tabItems.slice(3).map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="max-md:hidden flex items-center gap-2">
            {tabItems.slice(3).map((tab, idx) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-value={tab.value}
                ref={(el: HTMLButtonElement | null): void => {
                  tabsRef.current[idx + 3] = el;
                }}
                className={cn(
                  "data-[state=active]:bg-transparent data-[state=active]:border-none rounded-none px-4 py-2 text-sm font-medium text-muted-foreground transition-colors"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </div>
          <motion.div
            className="absolute bottom-0 h-[2px] bg-primary"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        </TabsList>

        <div className="mt-5">
          <div className="flex gap-16 max-2xl:gap-5">
            <div className="max-md:hidden">
              <ProfileLeftSide user={user} />
            </div>
            <div className="flex-1">
              <TabsContent value="home">
                <HomeContent user={user} />
              </TabsContent>
              <TabsContent value="photos">
                <PhotosTab />
              </TabsContent>
              <TabsContent value="videos">
                <VideosTab />
              </TabsContent>
              <TabsContent value="following">
                <FollowingContent />
              </TabsContent>
              <TabsContent value="marketplace">
                <UserListings />
              </TabsContent>
              <TabsContent value="chat">
                <ChatContent />
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
