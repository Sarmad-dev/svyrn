/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight, Play, Users, Heart, MessageCircle, Eye } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { StoryUploadDialog } from "./story-uploader";
import { User } from "@/types/global";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getTImelineStories } from "@/lib/actions/story.action";
import { StoryViewer } from "./story-viewver";

export const StoryPreview = ({ user }: { user: User }) => {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data } = authClient.useSession();
  const { data: stories } = useQuery({
    queryKey: ["getStories", data?.user.id],
    queryFn: async () =>
      await getTImelineStories({ token: data?.session.token as string }),
    enabled: !!data?.user.id && !!data?.session.token,
  });

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [stories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 280; // Width of story card + gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatStoryData = (story: any) => {
    console.log('[DEBUG] formatStoryData input:', story);
    
    const formattedData = story.stories.flatMap((str: any) =>
      str.content.media.map((media: any, index: number) => ({
        id: `${story.author._id}-${str._id}-${index}`,
        type: media.type,
        url: media.url,
        thumbnail: media.thumbnail,
        caption: media.caption || "",
        duration: media.duration || 5,
        name: story.author.name,
        avatarUrl: story.author.profilePicture,
        hasViewed: str.hasViewed,
        storyId: str._id,
        authorId: story.author._id,
      }))
    );
    
    console.log('[DEBUG] formatStoryData output:', formattedData);
    return formattedData;
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Desktop/Mobile Stories Container */}
      <div className="relative py-4 md:py-6 md:px-6">
        {/* Left scroll button - Desktop only */}
        {showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-2xl items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-white/50 dark:border-gray-600/50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        )}

        {/* Right scroll button - Desktop only */}
        {showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-2xl items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-white/50 dark:border-gray-600/50"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        )}

        {/* Stories scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-3 md:gap-4 snap-x snap-mandatory scroll-smooth px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Create Story Card */}
          <div className="flex-shrink-0 snap-start">
            <StoryUploadDialog user={user} />
          </div>

          {/* Story Cards */}
          {stories &&
            stories.length > 0 &&
            stories.map((story: any) => {
              const hasUnviewed = story.hasUnviewed;
              const firstMedia = story.stories[0]?.content?.media?.[0];
              
              return (
                <div
                  key={story.author._id}
                  className="flex-shrink-0 snap-start cursor-pointer group"
                  onClick={() => {
                    console.log('[DEBUG] Story clicked:', story);
                    const storyData = formatStoryData(story);
                    console.log('[DEBUG] Setting selectedStory:', storyData);
                    setSelectedStory(storyData);
                  }}
                >
                  <div className="relative">
                    {/* Story Card */}
                    <div className="w-[120px] h-[200px] md:w-[140px] md:h-[240px] rounded-3xl overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:scale-[1.05] transition-all duration-500 shadow-xl group-hover:shadow-2xl border-2 border-white/50 dark:border-gray-600/50">
                      {/* Background Image */}
                      {firstMedia && (
                        <Image
                          src={firstMedia.thumbnail || firstMedia.url}
                          alt={story.author.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 120px, 140px"
                          loading="lazy"
                        />
                      )}
                      
                      {/* Enhanced Multi-layer Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-80 transition-opacity duration-700" />
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      {/* Video Play Icon */}
                      {firstMedia?.type === 'video' && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
                      
                      {/* Multiple Media Indicator */}
                      {story.stories.reduce((total: number, s: any) => total + s.content.media.length, 0) > 1 && (
                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 group-hover:bg-black/90 transition-colors duration-300">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-white" />
                            <span className="text-sm text-white font-bold">
                              {story.stories.reduce((total: number, s: any) => total + s.content.media.length, 0)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Story Stats (only for own stories) */}
                      {story.author._id === data?.user.id && (
                        <div className="absolute bottom-12 left-3 right-3 flex flex-wrap items-center gap-2 text-white">
                          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-sm font-bold">
                              {story.stories[0]?.viewsCount || 0}
                            </span>
                          </div>
                          {story.stories[0]?.reactionsCount > 0 && (
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500/80 to-pink-500/80 backdrop-blur-md rounded-full px-3 py-1.5">
                              <Heart className="w-3.5 h-3.5 fill-white text-white" />
                              <span className="text-sm font-bold">{story.stories[0].reactionsCount}</span>
                            </div>
                          )}
                          {story.stories[0]?.commentsCount > 0 && (
                            <div className="flex items-center gap-1.5 bg-blue-500/80 backdrop-blur-md rounded-full px-3 py-1.5">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="text-sm font-bold">{story.stories[0].commentsCount}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Author Name */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-bold truncate drop-shadow-lg">
                          {story.author.name}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Profile Picture with Animated Ring */}
                    <div className="absolute -top-3 left-3">
                      <div className={`relative p-1.5 rounded-full transition-all duration-500 ${
                        hasUnviewed 
                          ? 'bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-orange-400 group-hover:from-violet-600 group-hover:via-fuchsia-600 group-hover:to-orange-500 animate-pulse' 
                          : 'bg-gradient-to-tr from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 group-hover:from-gray-400 group-hover:to-gray-500 dark:group-hover:from-gray-500 dark:group-hover:to-gray-400'
                      }`}>
                        <div className="bg-white dark:bg-gray-900 rounded-full p-1">
                          <Image
                            src={story.author.profilePicture || '/images/user.png'}
                            alt={story.author.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Floating Glow Effect */}
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none ${
                      hasUnviewed 
                        ? 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                        : 'shadow-[0_0_20px_rgba(107,114,128,0.3)]'
                    }`} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          stories={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
