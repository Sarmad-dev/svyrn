/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Reel } from "@/types/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommentsBottomSheet } from "./comments-bottom-sheet";
import { toggleReelReaction, toggleSaveReel } from "@/lib/actions/reel.action";
import Image from "next/image";

interface FullscreenReelsViewerProps {
  reels: Reel[];
  initialReelIndex: number;
  onClose: () => void;
  onReelChange?: (reelIndex: number) => void;
  token: string;
  currentUser: any;
}

export function FullscreenReelsViewer({
  reels,
  initialReelIndex,
  onClose,
  onReelChange,
  token,
  currentUser,
}: FullscreenReelsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [localReels, setLocalReels] = useState<Reel[]>(reels);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = localReels[currentIndex];

  console.log("Current reel", currentReel);

  // Check if current user has liked/saved the reel
  useEffect(() => {
    if (currentReel) {
      setIsLiked(currentReel.reactions.some((r) => r.user._id === currentUser.id));
      setIsSaved(currentReel.saves.some((s) => s.user._id === currentUser.id)); // This should be updated with actual save status
    }
  }, [currentReel, currentUser.id]);

  // Handle vertical scrolling
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0 && currentIndex < localReels.length - 1) {
        // Scroll down - next reel
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up - previous reel
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [currentIndex, localReels.length]
  );

  // Handle touch/swipe gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const startY = touch.clientY;

      const handleTouchEnd = (e: TouchEvent) => {
        const touch = e.changedTouches[0];
        const endY = touch.clientY;
        const diffY = startY - endY;

        if (Math.abs(diffY) > 50) {
          // Minimum swipe distance
          if (diffY > 0 && currentIndex < localReels.length - 1) {
            // Swipe up - next reel
            setCurrentIndex((prev) => prev + 1);
          } else if (diffY < 0 && currentIndex > 0) {
            // Swipe down - previous reel
            setCurrentIndex((prev) => prev - 1);
          }
        }
      };

      document.addEventListener("touchend", handleTouchEnd, { once: true });
    },
    [currentIndex, localReels.length]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < localReels.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
          break;
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          if (currentReel.media.type === "video") {
            setIsPlaying(!isPlaying);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentIndex,
    localReels.length,
    currentReel?.media.type,
    isPlaying,
    onClose,
  ]);

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Notify parent of reel change
  useEffect(() => {
    onReelChange?.(currentIndex);
  }, [currentIndex, onReelChange]);

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current && currentReel?.media.type === "video") {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentReel?.media.type]);

  // Auto-play next reel when current one ends
  const handleVideoEnded = () => {
    if (currentIndex < localReels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleLike = async () => {
    try {
      const result = await toggleReelReaction(token, {
        reelId: currentReel._id,
        reactionType: "like",
      });

      // Update local state
      setLocalReels((prev) =>
        prev.map((reel) =>
          reel._id === currentReel._id
            ? {
                ...reel,
                reactions: result.reactionType
                  ? [
                      ...reel.reactions,
                      {
                        user: currentUser.id,
                        type: "like",
                        createdAt: new Date(),
                      },
                    ]
                  : reel.reactions.filter((r) => r.user !== currentUser.id),
              }
            : reel
        )
      );

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await toggleSaveReel(token, currentReel._id);

      // Update local state
      setLocalReels((prev) =>
        prev.map((reel) =>
          reel._id === currentReel._id
            ? {
                ...reel,
                saves: result.isSaved
                  ? [...reel.saves, { user: currentUser.id, savedAt: new Date() }]
                  : reel.saves.filter((s) => s.user._id !== currentUser.id),
              }
            : reel
        )
      );

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const handleComment = () => {
    setIsCommentsOpen(true);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: currentReel.caption || "Check out this reel!",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!currentReel) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
        >
          {/* Media Content */}
          <div className="relative w-full h-full max-w-md mx-auto">
            {currentReel.media.type === "image" ? (
              <div className="w-full md:w-[600px] h-full relative">
                <Image
                  src={currentReel.media.url}
                  alt={currentReel.caption || "Reel"}
                  fill
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-screen sm:w-[600px] h-screen">
                <video
                  ref={videoRef}
                  src={currentReel.media.url}
                  className="object-cover h-screen"
                  loop
                  playsInline
                  onEnded={handleVideoEnded}
                />
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={currentReel.author.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600">
                    {currentReel.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {currentReel.author.name}
                  </p>
                  {currentReel.author.username && (
                    <p className="text-white/70 text-sm">
                      @{currentReel.author.username}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white bg-transparent hover:bg-transparent cursor-pointer hover:text-white hover:transition-all hover:scale-110 rounded-full"
                >
                  Follow
                </Button>
              </div>

              {/* Caption */}
              {currentReel.caption && (
                <p className="text-white mb-4 text-sm leading-relaxed">
                  {currentReel.caption}
                </p>
              )}

              {/* Tags */}
              {currentReel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentReel.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-6">
            <div className="flex flex-col">
              <Button
                onClick={handleLike}
                className={cn(
                  "text-white p-0 size-12 bg-transparent hover:bg-transparent hover:scale-110 hover:transition-all hover:text-red-500 transition-all duration-200 cursor-pointer",
                  isLiked && "text-red-500 scale-110"
                )}
              >
                <Heart
                  fill={isLiked ? "red" : "none"}
                  className="size-full hover:transition-all hover:scale-110"
                />
              </Button>

              <div className="text-center text-white text-sm">
                <p className="font-semibold">{currentReel.reactions.length}</p>
              </div>
            </div>

            <div className="flex flex-col">
              <Button
                onClick={handleComment}
                className="text-white p-0 size-12 hover:bg-transparent bg-transparent cursor-pointer hover:scale-110 hover:transition-all rounded-full transition-all duration-200"
              >
                <MessageCircle
                  color="white"
                  className="size-full hover:transition-all hover:scale-110"
                />
              </Button>

              <div className="text-center text-white text-sm">
                <p className="font-semibold">{currentReel.commentCount || 0}</p>
              </div>
            </div>

            <Button
              onClick={handleShare}
              className="text-white p-0 size-12 hover:bg-transparent bg-transparent cursor-pointer hover:scale-110 hover:transition-all rounded-full transition-all duration-200"
            >
              <Share2
                color="white"
                className="size-full hover:transition-all hover:scale-110"
              />
            </Button>

            <Button
              onClick={handleSave}
              className={cn(
                "text-white p-0 size-12 hover:bg-transparent bg-transparent cursor-pointer hover:scale-110 hover:transition-all rounded-full transition-all duration-200",
                isSaved && "text-yellow-400 scale-110"
              )}
            >
              <Bookmark
                className="size-full hover:transition-all hover:scale-110"
                fill={isSaved ? "yellow" : "none"}
              />
            </Button>
          </div>

          {/* Navigation Hints */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/50">
            <ChevronUp size={24} />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/50">
            <ChevronDown size={24} />
          </div>
        </div>
      </div>

      {/* Comments Bottom Sheet */}
      <CommentsBottomSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reelId={currentReel._id}
        token={token}
        currentUser={currentUser}
      />
    </>
  );
}
