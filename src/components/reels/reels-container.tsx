"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Home, Plus, Users, User } from 'lucide-react'
import { ReelItem } from './reel-item'
import { cn } from '@/lib/utils'

interface Reel {
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
}

interface ReelsContainerProps {
  reels: Reel[]
  className?: string
}

export function ReelsContainer({ reels, className }: ReelsContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
  }

  const handleReelLike = (id: string) => {
    console.log('Liked reel:', id)
    // Implement like functionality
  }

  const handleReelComment = (id: string) => {
    console.log('Comment on reel:', id)
    // Implement comment functionality
  }

  const handleReelShare = (id: string) => {
    console.log('Share reel:', id)
    // Implement share functionality
  }

  const handleReelFollow = (username: string) => {
    console.log('Follow user:', username)
    // Implement follow functionality
  }

  // Auto-advance reels (optional)
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      handleNext()
    }, 10000) // Change reel every 10 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          handlePrevious()
          break
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
          event.preventDefault()
          handleNext()
          break
        case 'Escape':
          setIsAutoPlaying(!isAutoPlaying)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAutoPlaying])

  if (reels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reels Available</h2>
          <p className="text-gray-600">Check back later for new content!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full h-screen bg-black", className)}>
      {/* Main Reel Display */}
      <div className="relative w-full h-full">
        <ReelItem
          {...reels[currentIndex]}
          onLike={handleReelLike}
          onComment={handleReelComment}
          onShare={handleReelShare}
          onFollow={handleReelFollow}
        />
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <div className="hidden md:block">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {reels.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Reel Counter */}
      <div className="absolute top-20 right-4 z-20 text-white text-sm">
        {currentIndex + 1} / {reels.length}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors">
            <Home size={20} />
            <span className="text-xs">Home</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-black">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="text-xs">Reels</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors">
            <Plus size={20} />
            <span className="text-xs">Create</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors">
            <Users size={20} />
            <span className="text-xs">Friends</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-black transition-colors">
            <User size={20} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Swipe Instructions */}
      <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20 text-white text-center">
        <p className="text-sm opacity-70">Swipe up/down to navigate</p>
      </div>
    </div>
  )
}
