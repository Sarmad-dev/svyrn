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
import { getComments } from "@/lib/actions/post.action";

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 w-full">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={authorAvatar || "/images/user.png"}
              alt={authorName}
            />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">
                <Link href={`/user/${authorId}`} className="hover:underline">
                  {authorName}
                </Link>
              </span>
              {authorIsVerified && (
                <Badge variant="default" className="w-4 h-4 p-0">
                  <svg
                    className="w-3 h-3"
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
                  className="hover:underline">
                  {group?.name}
                </Link>
              </p>
            )}
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
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
              <div className="relative w-full h-[420px] max-md:h-96 cursor-pointer">
                <Image
                  src={content.media[0].url}
                  alt="Post content"
                  fill
                  objectFit="contain"
                />
              </div>
            }
          />
        )}

      {content.media &&
        content.media?.length > 0 &&
        content.media[0].type == "video" && (
          <div className="aspect-video relative z-0 mb-4 w-full">
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
        {content.text && (
          <p className="text-gray-800 mb-3 text-sm">{content.text}</p>
        )}
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
          <Button
            variant="outline"
            className="border-none cursor-pointer hover:text-blue-500">
            <Share2 />
          </Button>
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

        {/* Comments */}
        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-3">
              {commentToShow &&
                commentToShow.length > 0 &&
                commentToShow.map((comment: Comment, index: number) => (
                  <CommentItem
                    key={index}
                    comment={comment as Comment}
                    postId={_id}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Comment */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
          <Avatar>
            <AvatarImage
              src={currentUser?.profilePicture || "/images/user.png"}
              alt="Your avatar"
            />
          </Avatar>
          <CommentInput postId={_id} />
        </div>
      </div>
    </div>
  );
};
