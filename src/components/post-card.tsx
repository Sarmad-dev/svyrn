import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formateDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Share2 } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
    },
  });
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
              (reaction) => reaction.user === currentUser?.id
            )}
            isReactedType={
              reactions.find((reaction) => reaction.user === currentUser?.id)
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
            <DialogContent className="p-4">
              <DialogHeader>
                <DialogTitle>Share post</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex gap-2 text-sm">
                  <button
                    className={`px-3 py-1 rounded-full border ${shareDest === "feed" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setShareDest("feed")}
                  >
                    Feed
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full border ${shareDest === "group" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setShareDest("group")}
                  >
                    Group
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full border ${shareDest === "conversation" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setShareDest("conversation")}
                  >
                    Conversation
                  </button>
                </div>
                {shareDest === "group" && (
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Target group ID"
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                  />
                )}
                {shareDest === "conversation" && (
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Target conversation ID"
                    value={targetConversationId}
                    onChange={(e) => setTargetConversationId(e.target.value)}
                  />
                )}
                <Textarea
                  placeholder="Add a caption (optional)"
                  value={shareCaption}
                  onChange={(e) => setShareCaption(e.target.value)}
                  className="h-24"
                />
                <Button
                  className="w-full bg-blue-500 text-white"
                  disabled={shareMutation.isPending || (shareDest === "group" && !targetGroupId) || (shareDest === "conversation" && !targetConversationId)}
                  onClick={() => shareMutation.mutateAsync()}
                >
                  {shareMutation.isPending ? "Sharing..." : "Share"}
                </Button>
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
