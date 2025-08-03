"use client";
import DiscoverGroupContent from "@/components/group/tabs-content/discover-group-content";
import YourFeedContent from "@/components/group/tabs-content/your-feed-content";
import YourGroupsContent from "@/components/group/tabs-content/your-group-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Compass, Users } from "lucide-react";

const Groups = () => {
  return (
    <div className="">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="bg-[#f1f4f3] rounded-full w-full max-md:w-screen flex h-[60px] justify-between gap-4 max-md:gap-1 p-1 transition-all duration-300">
          <TabsTrigger
            value="feed"
            className="transition-all duration-300 ease-in-out px-4 py-2 rounded-full flex items-center gap-2 text-black data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white data-[state=active]:shadow-md max-md:text-sm">
            <Archive className="w-4 h-4 transition-all duration-300 ease-in-out" />
            Your feed
          </TabsTrigger>

          <TabsTrigger
            value="discover"
            className="transition-all duration-300 ease-in-out px-4 py-2 rounded-full flex items-center gap-2 text-black data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white data-[state=active]:shadow-md max-md:text-sm">
            <Compass className="w-4 h-4 transition-all duration-300 ease-in-out" />
            Discover
          </TabsTrigger>

          <TabsTrigger
            value="groups"
            className="transition-all duration-300 ease-in-out px-4 py-2 rounded-full flex items-center gap-2 text-black data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white data-[state=active]:shadow-md max-md:text-sm">
            <Users className="w-4 h-4 transition-all duration-300 ease-in-out" />
            Your groups
          </TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <YourFeedContent />
        </TabsContent>
        <TabsContent value="discover">
          <DiscoverGroupContent />
        </TabsContent>
        <TabsContent value="groups">
          <YourGroupsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Groups;
