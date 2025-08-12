"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause, Volume2, VolumeX, Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReelItemProps {
  id: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  username: string
  userAvatar: string
  caption: string
  likes: number
  comments: number
  shares: number
  isFollowing?: boolean
  onLike?: (id: string) => void
  onComment?: (id: string) => void
  onShare?: (id: string) => void
  onFollow?: (username: string) => void
  className?: string
}

export function ReelItem({
  id,
  mediaUrl,
  mediaType,
  username,
  userAvatar,
  caption,
  likes,
  comments,
  shares,
  isFollowing = false,
  onLike,
  onComment,
  onShare,
  onFollow,
  className
}: ReelItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike?.(id)
  }

  const handlePlayPause = () => {
    if (mediaType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[600px] md:min-h-[700px] bg-black rounded-lg overflow-hidden group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Content */}
      <div className="relative w-full h-full">
        {mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt={caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {/* Play/Pause Overlay for Videos */}
        {mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className={cn(
                "p-4 bg-black/50 rounded-full text-white transition-all duration-300",
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              )}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-bold">Reels</h1>
            <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Right Side Interaction Bar */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div className={cn(
              "p-3 rounded-full transition-colors",
              isLiked ? "bg-red-500" : "bg-black/30 hover:bg-black/50"
            )}>
              <Heart 
                size={24} 
                className={cn(
                  "transition-colors",
                  isLiked ? "fill-white" : "fill-none"
                )}
              />
            </div>
            <span className="text-sm font-medium">{formatCount(likes)}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => onComment?.(id)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div className="p-3 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
              <MessageCircle size={24} />
            </div>
            <span className="text-sm font-medium">{formatCount(comments)}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare?.(id)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
          >
            <div className="p-3 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
              <Share2 size={24} />
            </div>
            <span className="text-sm font-medium">{formatCount(shares)}</span>
          </button>

          {/* More Options */}
          <button className="p-3 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Bottom Left Content Info */}
        <div className="absolute bottom-20 left-4 max-w-[280px] z-10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={userAvatar} alt={username} />
              <AvatarFallback className="bg-gray-600 text-white">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold">{username}</span>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors"
              onClick={() => onFollow?.(username)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
          
          <div className="text-white">
            <p className="text-sm mb-2 line-clamp-2">
              {showCaption ? caption : `${caption.slice(0, 50)}...`}
              {caption.length > 50 && (
                <button
                  onClick={() => setShowCaption(!showCaption)}
                  className="ml-1 font-semibold hover:underline"
                >
                  {showCaption ? 'less' : 'more'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Video Controls for Desktop */}
        {mediaType === 'video' && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <button
              onClick={handleMuteToggle}
              className="p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
