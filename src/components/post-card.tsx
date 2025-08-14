/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formateDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Share2, Users, MessageSquare, Globe } from "lucide-react";
import BeautifulVideo from "./beautiful-video";
import ReactionPopover from "./post/reactions/reaction-popover";
import { Comment, Reaction, User } from "@/types/global";
import CommentInput from "./post/comment/comment-input";
import { AnimatePresence, motion } from "framer-motion";
import CommentItem from "./post/comment/comment-item";
import { PostMediaDialog } from "./post/post-media-dialog";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getComments, sharePost } from "@/lib/actions/post.action";
import { getUserGroups } from "@/lib/actions/group.action";
import { getConversations } from "@/lib/actions/conversation.action";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
interface PostCardProps {
  _id: string;
  author: {
    name: string;
    profilePicture: string;
    isVerified: boolean;
    _id: string;
  };
  createdAt: Date;
  content: {
    text?: string;
    media?: {
      type: "image" | "video" | "document";
      url: string;
      caption: string;
      size: number;
      duration: number;
    }[];
  };
  reactions: Reaction[];
  comments?: {
    content?: string;
    author: {
      name: string;
      profilePicture: string;
    };
    createdAt: Date | string;
  }[];
  isGroup?: boolean;
  group?: {
    _id: string;
    name: string;
  };
  currentUser?: User;
}
export const PostCard = ({
  _id,
  author: {
    name: authorName,
    profilePicture: authorAvatar,
    isVerified: authorIsVerified,
    _id: authorId,
  },
  isGroup = false,
  createdAt,
  content,
  reactions,
  group,
  currentUser,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { data: session } = authClient.useSession();
  const [isShareOpen, setShareOpen] = useState(false);
  const [shareDest, setShareDest] = useState<"feed" | "group" | "conversation">("feed");
  const [shareCaption, setShareCaption] = useState("");
  const [targetGroupId, setTargetGroupId] = useState<string>("");
  const [targetConversationId, setTargetConversationId] = useState<string>("");

  // Fetch user groups and conversations
  const { data: userGroups, isLoading: isLoadingGroups, error: groupsError } = useQuery({
    queryKey: ["user-groups"],
    queryFn: () => getUserGroups({ token: session?.session.token as string }),
    enabled: !!session?.session.token && isShareOpen,
  });

  const { data: conversationsData, isLoading: isLoadingConversations, error: conversationsError } = useQuery({
    queryKey: ["user-conversations"],
    queryFn: () => getConversations({ 
      token: session?.session.token as string,
      page: 1,
      limit: 50
    }),
    enabled: !!session?.session.token && isShareOpen,
  });

  const shareMutation = useMutation({
    mutationKey: ["share-post", _id],
    mutationFn: async () =>
      await sharePost({
        token: session?.session.token as string,
        postId: _id,
        destination: shareDest,
        caption: shareCaption,
        groupId: shareDest === "group" ? targetGroupId : undefined,
        conversationId: shareDest === "conversation" ? targetConversationId : undefined,
      }),
    onSuccess: () => {
      setShareOpen(false);
      setShareCaption("");
      setTargetGroupId("");
      setTargetConversationId("");
      toast.success("Post shared successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to share post. Please try again.";
      toast.error(errorMessage);
      console.error("Share error:", error);
    },
  });

  const handleShare = () => {
    // Validate required fields based on destination
    if (shareDest === "group" && !targetGroupId) {
      toast.error("Please select a group to share to");
      return;
    }
    if (shareDest === "conversation" && !targetConversationId) {
      toast.error("Please select a conversation to share to");
      return;
    }
    
    // Additional validation
    if (shareDest === "group" && (!userGroups || userGroups.length === 0)) {
      toast.error("No groups available to share to");
      return;
    }
    if (shareDest === "conversation" && (!conversationsData || !conversationsData.conversations || conversationsData.conversations.length === 0)) {
      toast.error("No conversations available to share to");
      return;
    }
    
    shareMutation.mutate();
  };

  const resetShareForm = () => {
    setShareDest("feed");
    setShareCaption("");
    setTargetGroupId("");
    setTargetConversationId("");
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isShareOpen) {
      resetShareForm();
    }
  }, [isShareOpen]);
  const { data: commentToShow } = useQuery({
    queryKey: ["get-post-comments", _id],
    queryFn: async () =>
      await getComments({
        postId: _id as string,
        token: session?.session.token as string,
      }),
    enabled: !!session?.session.token,
  });
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 w-full border border-gray-100">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={authorAvatar || "/images/user.png"}
              alt={authorName}
            />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/user/${authorId}`}
                className="font-semibold text-sm text-gray-900 hover:underline">
                {authorName}
              </Link>
              {authorIsVerified && (
                <Badge variant="default" className="w-4 h-4 p-0 bg-blue-600">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </Badge>
              )}
              <span className="text-gray-500 text-xs">
                • {formateDate(createdAt)}
              </span>
            </div>
            {isGroup && (
              <p className="text-sm text-gray-600">
                in{" "}
                <Link
                  href={`/groups/${group?._id as string}`}
                  className="text-blue-600 hover:underline">
                  {group?.name}
                </Link>
              </p>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      {content.text && (
        <p className="px-4 pb-3 text-gray-800 text-base">{content.text}</p>
      )}

      {content.media &&
        content.media?.length > 0 &&
        content.media[0].type == "image" && (
          <PostMediaDialog
            media={content.media}
            comments={commentToShow ?? ([] as Comment[])}
            reactions={reactions}
            postId={_id}
            currentUser={currentUser as User}
            author={{
              name: authorName,
              profilePicture: authorAvatar ?? authorAvatar,
              isVerified: authorIsVerified,
            }}
            trigger={
              <div className="relative w-full aspect-[4/2.5] bg-gray-100 cursor-pointer">
                <Image
                  src={content.media[0].url}
                  alt="Post content"
                  fill
                  priority={false}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnLz48L3N2Zz4="
                  className="object-cover"
                />
              </div>
            }
          />
        )}

      {content.media &&
        content.media?.length > 0 &&
        content.media[0].type == "video" && (
          <div className="aspect-video relative z-0 w-full">
            <BeautifulVideo
              src={content.media[0].url}
              plyrOptions={{
                invertTime: false,
                quality: { default: 720, options: [1080, 720, 480] },
              }}
            />
          </div>
        )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <ReactionPopover
            postId={_id}
            isReacted={reactions.some(
              (reaction) => reaction.user._id === currentUser?.id
            )}
            isReactedType={
              reactions.find((reaction) => reaction.user._id === currentUser?.id)
                ?.type as "like" | "love" | "haha" | "wow" | "sad" | "angry"
            }
          />
          <Button
            variant="outline"
            size="icon"
            className="border-none cursor-pointer"
            onClick={() => setShowComments((prev) => !prev)}>
            <MessageCircle />
          </Button>
          <Dialog open={isShareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-none cursor-pointer hover:text-blue-500">
                <Share2 />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-md mx-auto">
              <DialogHeader className="text-center mb-6">
                <DialogTitle className="text-2xl font-bold text-gray-900">Share Post</DialogTitle>
                <p className="text-gray-500 mt-2">Choose where you&apos;d like to share this post</p>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Destination Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Share to:</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        shareDest === "feed" 
                          ? "border-blue-500 bg-blue-50 text-blue-600" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setShareDest("feed")}
                    >
                      <Globe size={20} />
                      <span className="text-xs font-medium">Feed</span>
                    </button>
                    <button
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        shareDest === "group" 
                          ? "border-blue-500 bg-blue-50 text-blue-600" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setShareDest("group")}
                    >
                      <Users size={20} />
                      <span className="text-xs font-medium">Group</span>
                    </button>
                    <button
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        shareDest === "conversation" 
                          ? "border-blue-500 bg-blue-50 text-blue-600" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setShareDest("conversation")}
                    >
                      <MessageSquare size={20} />
                      <span className="text-xs font-medium">Chat</span>
                    </button>
                  </div>
                </div>

                {/* Target Selection */}
                {shareDest === "group" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Group:</label>
                    {!isLoadingGroups && !groupsError && userGroups && userGroups.length === 0 && (
                      <div className="p-3 text-center text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm">You&apos;re not a member of any groups yet.</p>
                        <p className="text-xs text-amber-500 mt-1">Join a group to share posts there.</p>
                      </div>
                    )}
                    <Select onValueChange={(value) => setTargetGroupId(value)} value={targetGroupId}>
                      <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                        <SelectValue placeholder="Choose a group to share to" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingGroups ? (
                          <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            Loading groups...
                          </div>
                        ) : groupsError ? (
                          <div className="p-3 text-center text-red-500">
                            Failed to load groups
                          </div>
                        ) : userGroups && userGroups.length > 0 ? (
                          userGroups.map((group: any) => (
                            <SelectItem key={group._id} value={group._id} className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-500" />
                                <span>{group.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            No groups available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {shareDest === "conversation" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Conversation:</label>
                    {!isLoadingConversations && !conversationsError && conversationsData && (!conversationsData.conversations || conversationsData.conversations.length === 0) && (
                      <div className="p-3 text-center text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm">You don&apost have any active conversations yet.</p>
                        <p className="text-xs text-amber-500 mt-1">Start a conversation to share posts there.</p>
                      </div>
                    )}
                    <Select onValueChange={(value) => setTargetConversationId(value)} value={targetConversationId}>
                      <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                        <SelectValue placeholder="Choose a conversation to share to" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingConversations ? (
                          <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            Loading conversations...
                          </div>
                        ) : conversationsError ? (
                          <div className="p-3 text-center text-red-500">
                            Failed to load conversations
                          </div>
                        ) : conversationsData && conversationsData.conversations?.length > 0 ? (
                          conversationsData.conversations.map((conv: any) => (
                            <SelectItem key={conv._id} value={conv._id} className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <MessageSquare size={16} className="text-gray-500" />
                                <span>
                                  {conv.name || 
                                    (conv.participants && conv.participants.length > 1 
                                      ? `Group Chat (${conv.participants.length} people)`
                                      : conv.participants && conv.participants.length === 1
                                      ? `Direct Message`
                                      : 'Conversation'
                                    )
                                  }
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            No conversations available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Caption Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Add a caption (optional):</label>
                  <Textarea
                    placeholder="What's on your mind about this post?"
                    value={shareCaption}
                    onChange={(e) => setShareCaption(e.target.value)}
                    className="min-h-[100px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {shareCaption.length}/500
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 hover:border-gray-300"
                    onClick={resetShareForm}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={
                      shareMutation.isPending || 
                      isLoadingGroups || 
                      isLoadingConversations ||
                      (shareDest === "group" && !targetGroupId) || 
                      (shareDest === "conversation" && !targetConversationId) ||
                      (shareDest === "group" && (!userGroups || userGroups.length === 0)) ||
                      (shareDest === "conversation" && (!conversationsData || !conversationsData.conversations || conversationsData.conversations.length === 0))
                    }
                    onClick={handleShare}
                  >
                    {shareMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sharing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Share2 size={16} />
                        Share Post
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <button className="ml-auto text-gray-600 hover:text-gray-800">
            <Bookmark />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">
            {reactions.length} likes
          </span>
          <span className="text-sm text-gray-500">😍 😃</span>
        </div>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4 overflow-hidden">
        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4 will-change-transform">
              {commentToShow &&
                commentToShow.length > 0 &&
                commentToShow.map((comment: Comment, index: number) => (
                  <CommentItem
                    key={index}
                    comment={comment as Comment}
                    postId={_id}
                  />
                ))}
              <CommentInput postId={_id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
