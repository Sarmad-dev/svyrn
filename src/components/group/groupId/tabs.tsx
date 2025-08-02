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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="relative">
        <TabsList className="relative flex w-full justify-between gap-4 border-b border-gray-300">
          {tabItems.map((tab, idx) => (
            <div key={tab.value}>
              {tab.value === "settings" &&
              (!group?.isAdmin || !group?.isCreator) ? (
                <></>
              ) : (
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
              )}
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
        <TabsContent value="discussion">
          <DiscussionContent user={user} group={group as GroupWithPosts} />
        </TabsContent>
        <TabsContent value="about">
          <AboutTabContent group={group as GroupWithPosts} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTabContent group={group as GroupWithPosts} />
        </TabsContent>
        <TabsContent value="members">
          <MembersTabContent
            members={Array.isArray(group?.members) ? group.members : []}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
