/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react'
import { X, Send, Heart, MessageCircle, MoreHorizontal, Flag } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReelComment } from '@/types/global'
import { getReelComments, createReelComment, toggleCommentReaction } from '@/lib/actions/reel.action'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface CommentsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  reelId: string
  token: string
  currentUser: any
}

export function CommentsBottomSheet({ isOpen, onClose, reelId, token, currentUser }: CommentsBottomSheetProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const queryClient = useQueryClient()

  // Reset state when reelId changes
  useEffect(() => {
    setNewComment('')
    setIsSubmitting(false)
    setHasMore(true)
    setCursor(undefined)
    setIsLoadingMore(false)
  }, [reelId])

  // Cleanup mutations when component unmounts
  useEffect(() => {
    return () => {
      createCommentMutation.reset()
      toggleReactionMutation.reset()
    }
  }, [])

  // Query for comments
  const {
    data: commentsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['reelComments', reelId],
    queryFn: () => getReelComments(token, reelId, { limit: 20 }),
    enabled: isOpen && !!reelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const comments = commentsData?.comments || []
  const pagination = commentsData?.pagination

  // Load more comments
  const loadMoreComments = async () => {
    if (!pagination?.hasNextPage || !pagination?.nextCursor || isLoadingMore) return
    
    setIsLoadingMore(true)
    try {
      const result = await getReelComments(token, reelId, {
        cursor: pagination.nextCursor,
        limit: 20
      })
      
      // Update the query data with new comments
      queryClient.setQueryData(['reelComments', reelId], (oldData: any) => ({
        comments: [...(oldData?.comments || []), ...result.comments],
        pagination: result.pagination
      }))
      
      setHasMore(result.pagination?.hasNextPage)
      setCursor(result.pagination?.nextCursor)
    } catch (error) {
      console.error('Error loading more comments:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Mutation for creating comments
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createReelComment(token, { reelId, content }),
    onSuccess: (newComment) => {
      // Update the query data with the new comment
      queryClient.setQueryData(['reelComments', reelId], (oldData: any) => ({
        comments: [newComment, ...(oldData?.comments || [])],
        pagination: oldData?.pagination
      }))
      
      // Invalidate related queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['reelComments', reelId] })
      queryClient.invalidateQueries({ queryKey: ['reels'] }) // Invalidate reels list if it exists
      
      setNewComment('')
      setIsSubmitting(false)
    },
    onError: (error) => {
      console.error('Error creating comment:', error)
      setIsSubmitting(false)
    }
  })

  // Mutation for toggling reactions
  const toggleReactionMutation = useMutation({
    mutationFn: ({ commentId, reactionType }: { commentId: string; reactionType: string }) =>
      toggleCommentReaction(token, commentId, reactionType),
    onSuccess: (_, { commentId }) => {
      // Update the query data with the new reaction
      queryClient.setQueryData(['reelComments', reelId], (oldData: any) => ({
        comments: (oldData?.comments || []).map((comment: ReelComment) => 
          comment._id === commentId 
            ? { 
                ...comment, 
                reactions: [...(comment.reactions || []), { 
                  user: currentUser.id, 
                  type: 'like', 
                  createdAt: new Date() 
                }] 
              }
            : comment
        ),
        pagination: oldData?.pagination
      }))
    },
    onError: (error) => {
      console.error('Error toggling reaction:', error)
    }
  })

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    createCommentMutation.mutate(newComment.trim())
  }

  const handleLikeComment = async (commentId: string) => {
    toggleReactionMutation.mutate({ commentId, reactionType: 'like' })
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Comments</h3>
              <p className="text-sm text-gray-500">{comments?.length || 0} comments</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={24} className="text-red-500" />
              </div>
              <p className="text-red-600 font-medium mb-2">Failed to load comments</p>
              <p className="text-sm text-gray-500 mb-4">Something went wrong while loading the comments.</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-full"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {!error && comments && comments.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to comment!</p>
            </div>
          ) : (
            !error && comments && comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author?.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 text-xs">
                    {comment.author?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {comment.author?.name || 'Unknown User'}
                      </span>
                      {comment.author?.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        disabled={toggleReactionMutation.isPending}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Heart size={14} className={cn(
                          comment.reactions?.some((r: any) => r.user === currentUser.id) && "fill-red-500 text-red-500"
                        )} />
                        <span>{comment.reactions?.length || 0}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <MessageCircle size={14} />
                        <span>Reply</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <Flag size={14} />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          )}
          
          {createCommentMutation.isError && (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm">Failed to create comment. Please try again.</p>
            </div>
          )}
          
          {!error && pagination?.hasNextPage && !isLoading && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMoreComments}
                disabled={isLoadingMore}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More Comments'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 text-xs">
                {currentUser.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 relative">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="pr-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-full"
                disabled={isSubmitting || createCommentMutation.isPending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim() || isSubmitting || createCommentMutation.isPending}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full disabled:opacity-50"
              >
                {createCommentMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send size={14} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
