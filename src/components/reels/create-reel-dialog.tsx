/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useRef } from 'react'
import { X, Upload, Video, Image, Users, Globe, UserCheck, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from '@/types/global'
import { createReel } from '@/lib/actions/reel.action'

interface CreateReelDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onReelCreated?: () => void
  token: string
}

export function CreateReelDialog({ isOpen, onClose, user, onReelCreated, token }: CreateReelDialogProps) {
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [caption, setCaption] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private' | 'followers'>('public')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setMediaFile(file)
      
      // Determine media type
      if (file.type.startsWith('image/')) {
        setMediaType('image')
      } else if (file.type.startsWith('video/')) {
        setMediaType('video')
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setMediaFile(file)
      
      if (file.type.startsWith('image/')) {
        setMediaType('image')
      } else if (file.type.startsWith('video/')) {
        setMediaType('video')
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!mediaFile) {
      alert('Please select a media file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Convert file to base64
      const base64 = await fileToBase64(mediaFile)
      
      // Extract hashtags and mentions from caption
      const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || []
      const mentions = caption.match(/@\w+/g)?.map(mention => mention.slice(1)) || []
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)

      // Create reel via API
      const reel = await createReel(token, {
        mediaUrl: base64,
        mediaType,
        caption,
        privacy,
        location,
        tags: tagArray,
        hashtags,
        mentions,
      })

      onReelCreated?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error creating reel:', error)
      alert('Failed to create reel. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const resetForm = () => {
    setMediaFile(null)
    setMediaPreview('')
    setCaption('')
    setPrivacy('public')
    setLocation('')
    setTags('')
  }

  const getPrivacyIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public':
        return <Globe size={16} />
      case 'friends':
        return <Users size={16} />
      case 'followers':
        return <UserCheck size={16} />
      case 'private':
        return <EyeOff size={16} />
      default:
        return <Globe size={16} />
    }
  }

  const getPrivacyLabel = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public':
        return 'Public - Anyone can see this reel'
      case 'friends':
        return 'Friends - Only your friends can see this reel'
      case 'followers':
        return 'Followers - Only your followers can see this reel'
      case 'private':
        return 'Private - Only you can see this reel'
      default:
        return 'Public - Anyone can see this reel'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Reel</h2>
              <p className="text-sm text-gray-600">Share your moments with the world</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/80 rounded-xl"
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Media Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">Media</Label>
            
            {!mediaPreview ? (
              <div
                className={cn(
                  "border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-all duration-300 cursor-pointer bg-gray-50 hover:bg-purple-50",
                  mediaType === 'video' && "border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-4">
                  {mediaType === 'image' ? (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                      <Image size={32} className="text-purple-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
                      <Video size={32} className="text-blue-500" />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {mediaType === 'image' ? 'Upload Image' : 'Upload Video'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop or click to browse
                    </p>
                  </div>
                  
                  <Button type="button" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    <Upload size={16} className="mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                {mediaType === 'image' ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white border-gray-200"
                  onClick={() => {
                    setMediaFile(null)
                    setMediaPreview('')
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Media Type Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant={mediaType === 'image' ? 'default' : 'outline'}
              onClick={() => setMediaType('image')}
              className={cn(
                "flex items-center space-x-2 transition-all duration-200",
                mediaType === 'image' 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                  : "border-gray-200 hover:border-purple-200"
              )}
            >
              <Image size={16} />
              <span>Image</span>
            </Button>
            <Button
              type="button"
              variant={mediaType === 'video' ? 'default' : 'outline'}
              onClick={() => setMediaType('video')}
              className={cn(
                "flex items-center space-x-2 transition-all duration-200",
                mediaType === 'video' 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                  : "border-gray-200 hover:border-blue-200"
              )}
            >
              <Video size={16} />
              <span>Video</span>
            </Button>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-semibold text-gray-700">
              Caption <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your reel... Use #hashtags and @mentions"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={500}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl resize-none"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <span>💡</span>
                <span>Use #hashtags to reach more people</span>
              </div>
              <span className={cn(
                "font-medium",
                caption.length > 450 ? "text-red-500" : "text-gray-400"
              )}>
                {caption.length}/500
              </span>
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Privacy</Label>
            <Select value={privacy} onValueChange={(value: any) => setPrivacy(value)}>
              <SelectTrigger className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Friends</span>
                  </div>
                </SelectItem>
                <SelectItem value="followers">
                  <div className="flex items-center space-x-2">
                    <UserCheck size={16} />
                    <span>Followers</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center space-x-2">
                    <EyeOff size={16} />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 flex items-center space-x-2">
              {getPrivacyIcon(privacy)}
              <span>{getPrivacyLabel(privacy)}</span>
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
              Location <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="location"
              placeholder="Add location to your reel"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
              Tags <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="tags"
              placeholder="Add tags separated by commas (e.g., fun, creative, lifestyle)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-purple-700">Creating your reel...</span>
                <span className="text-purple-600 font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="border-gray-200 hover:bg-gray-50 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!mediaFile || isUploading}
              className="min-w-[120px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isUploading ? 'Creating...' : 'Create Reel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
