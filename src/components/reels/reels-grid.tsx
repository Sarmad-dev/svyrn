/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reel } from "@/types/global";
import { toggleReelReaction } from "@/lib/actions/reel.action";
import Image from "next/image";

interface ReelGridItemProps {
  reel: Reel;
  onReelClick?: (reel: Reel) => void;
  token: string;
  currentUser: any;
}

function ReelGridItem({
  reel,
  onReelClick,
  token,
  currentUser,
}: ReelGridItemProps) {
  const [isLiked, setIsLiked] = useState(
    reel.reactions.some((r) => r.user === currentUser?.id)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleReelReaction(token, {
        reelId: reel._id,
        reactionType: "like",
      });

      setIsLiked(!isLiked);
      // Update local state if needed
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reel.media.type === "video") {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="group relative bg-black rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
      onClick={() => onReelClick?.(reel)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Content */}
      <div className="relative aspect-[9/16] w-full">
        {reel.media.type === "image" ? (
          <div className="w-full h-full relative">
            <Image
              src={reel.media.url}
              alt={reel.caption || "Reel"}
              className="w-full h-full object-cover"
              fill
              objectFit="cover"
            />
          </div>
        ) : (
          <video
            src={reel.media.url}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {/* Play/Pause Overlay for Videos */}
        {reel.media.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
          </div>
        )}

        {/* Video Controls */}
        {reel.media.type === "video" && (
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMuteToggle}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>
        )}

        {/* Content Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-6 h-6 border border-white">
              <AvatarImage
                src={reel.author.profilePicture}
                alt={reel.author.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 text-xs">
                {reel.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{reel.author.name}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs bg-transparent border-white text-white hover:bg-transparent hover:border-white hover:text-white transition-colors rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement follow functionality
              }}
            >
              Follow
            </Button>
          </div>

          {reel.caption && (
            <p className="text-sm line-clamp-2 mb-1">{reel.caption}</p>
          )}

          {/* Tags */}
          {reel.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {reel.tags.slice(0, 2).map((tag, index) => (
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

        {/* Interaction Bar */}
        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                isLiked
                  ? "bg-red-500 shadow-lg"
                  : "bg-black/30 hover:bg-black/50"
              )}
            >
              <Heart
                size={16}
                className={cn(
                  "transition-all duration-200",
                  isLiked ? "fill-white scale-110" : "fill-none"
                )}
              />
            </div>
            <span className="text-xs font-medium">
              {formatCount(reel.reactions.length)}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement comment functionality
            }}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
              <MessageCircle size={16} />
            </div>
            <span className="text-xs font-medium">
              {formatCount(reel.comments.length)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement share functionality
            }}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
              <Share2 size={16} />
            </div>
            <span className="text-xs font-medium">
              {formatCount(reel.shares)}
            </span>
          </button>
        </div>

        {/* Trending Badge */}
        {reel.trending?.rank && reel.trending.rank <= 5 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            #{reel.trending.rank} Trending
          </div>
        )}
      </div>
    </div>
  );
}

interface ReelsGridProps {
  reels: Reel[];
  onReelClick?: (reel: Reel) => void;
  className?: string;
  token: string;
  currentUser: any;
}

export function ReelsGrid({
  reels,
  onReelClick,
  className,
  token,
  currentUser,
}: ReelsGridProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {reels.map((reel) => (
          <ReelGridItem
            key={reel._id}
            reel={reel}
            onReelClick={onReelClick}
            token={token}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
