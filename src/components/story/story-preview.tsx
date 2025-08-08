/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight } from "lucide-react";
import Image from "next/image"; // Optional: only if using Next.js Image
import React, { useState } from "react";
import { StoryUploadDialog } from "./story-uploader";
import { User } from "@/types/global";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getTImelineStories } from "@/lib/actions/story.action";
import { StoryViewer } from "./story-viewver";

export const StoryPreview = ({ user }: { user: User }) => {
  const [selectedStory, setSelectedStory] = useState<
    | {
        id: string | number;
        type: "image" | "video";
        url: string;
        name: string;
        avatarUrl: string;
        caption: string;
      }[]
    | null
  >(null);

  const { data } = authClient.useSession();
  const { data: stories } = useQuery({
    queryKey: ["getStories", data?.user.id],
    queryFn: async () =>
      await getTImelineStories({ token: data?.session.token as string }),
    enabled: !!data?.user.id && !!data?.session.token,
  });

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 py-4 snap-x snap-mandatory">
      <StoryUploadDialog user={user} />
      {stories &&
        stories.length > 0 &&
        stories.map((story: any) => {
          const storydata = story.stories.map((str: any) => ({
            id: story.author._id,
            type: str.content.media[0].type,
            url: str.content.media[0].url,
            name: story.author.name,
            avatarUrl: story.author.profilePicture,
            caption: str.content.caption as string,
          }));

          return (
            <div
              key={story.author._id}
              className="cursor-pointer min-w-[120px] md:min-w-[150px] h-[180px] md:h-[200px] rounded-xl overflow-hidden relative flex-shrink-0 shadow-md snap-start"
              onClick={() => {
                setSelectedStory(storydata);
              }}
            >
              <Image
                src={
                  story.stories[0].content.media[0].thumbnail ||
                  story.stories[0].content.media[0].url
                }
                alt={story.stories[0].content.caption as string}
                fill
                priority={false}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnLz48L3N2Zz4="
                sizes="(max-width: 768px) 40vw, 200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <Image
                src={story.author.profilePicture as string}
                alt="avatar"
                className="rounded-full border-2 border-white absolute top-2 left-2"
                width={32}
                height={32}
                loading="lazy"
              />
              <p className="absolute bottom-2 left-2 text-white text-xs md:text-sm font-medium line-clamp-1 pr-6">
                {story.stories[0].content.caption}
              </p>
            </div>
          );
        })}

      {/* Navigation Arrow */}
      <button className="min-w-[44px] md:min-w-[50px] h-[180px] md:h-[200px] rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
        <ChevronRight className="text-blue-500 w-6 h-6" />
      </button>

      {selectedStory && (
        <StoryViewer
          stories={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
};
