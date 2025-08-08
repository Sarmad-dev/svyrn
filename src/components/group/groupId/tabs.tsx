"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // or use clsx if you don't use cn helper
import DiscussionContent from "./discussion-content";
import { GroupWithPosts, User } from "@/types/global";
import AboutTabContent from "./about-tab-content";
import SettingsTabContent from "./settings-tab-content";
import MembersTabContent from "./members-tab-content";

const tabItems = [
  { label: "Discussion", value: "discussion" },
  { label: "About", value: "about" },
  { label: "Settings", value: "settings" },
  { label: "Members", value: "members" },
];

export function AnimatedTabs({
  user,
  group,
}: {
  user: User;
  group?: GroupWithPosts;
}) {
  const [activeTab, setActiveTab] = React.useState("discussion");
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

  // Filter tabs based on user permissions
  const visibleTabs = tabItems.filter((tab) => {
    if (tab.value === "settings") {
      return group?.isAdmin && group?.isCreator;
    }
    return true;
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="relative">
        <TabsList className="relative flex w-full justify-between gap-2 md:gap-4 border-b border-gray-200 bg-transparent p-0">
          {visibleTabs.map((tab, idx) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-value={tab.value}
              ref={(el: HTMLButtonElement | null): void => {
                tabsRef.current[idx] = el;
              }}
              className={cn(
                "data-[state=active]:bg-transparent data-[state=active]:border-none relative rounded-none px-3 md:px-4 py-3 text-sm md:text-base font-medium text-muted-foreground transition-colors hover:text-gray-900"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-blue-500"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        </TabsList>

        <div className="mt-6">
          <TabsContent value="discussion" className="mt-0">
            <DiscussionContent user={user} group={group as GroupWithPosts} />
          </TabsContent>
          <TabsContent value="about" className="mt-0">
            <AboutTabContent group={group as GroupWithPosts} />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SettingsTabContent group={group as GroupWithPosts} />
          </TabsContent>
          <TabsContent value="members" className="mt-0">
            <MembersTabContent
              members={Array.isArray(group?.members) ? group.members : []}
            />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
