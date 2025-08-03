"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // or use clsx if you don't use cn helper
import { User } from "@/types/global";
import HomeContent from "./home-content";
import FollowingContent from "./following-content";
import UserListings from "@/components/marketplace/listings/listings";
import ChatContent from "./chat-content";

const tabItems = [
  { label: "Home", value: "home" },
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
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full md:-mt-10 mt-5">
      <div className="relative">
        <TabsList className="relative flex w-[500px] max-md:w-screen mx-auto justify-between gap-4 border-b border-gray-300">
          {tabItems.map((tab, idx) => (
            <div key={tab.value}>
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-value={tab.value}
                ref={(el: HTMLButtonElement | null): void => {
                  tabsRef.current[idx] = el;
                }}
                className={cn(
                  "data-[state=active]:bg-transparent data-[state=active]:border-none relative rounded-none px-4 py-2 text-sm font-medium text-muted-foreground transition-colors"
                )}>
                {tab.label}
              </TabsTrigger>
            </div>
          ))}
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
          <TabsContent value="home">
            <HomeContent user={user} />
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
    </Tabs>
  );
}
