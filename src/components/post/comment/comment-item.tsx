// components/post/comment/CommentItem.tsx
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formateDate } from "@/lib/utils";
import { useState } from "react";
import ReplyBox from "./reply-box";
import { Comment } from "@/types/global";

export default function CommentItem({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  return (
    <div className="ml-0 mt-3">
      {!comment.parentComment && (
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage
              src={comment.author.profilePicture || "/images/user.png"}
              alt={comment.author.name}
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {formateDate(comment.createdAt)}
              </span>
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-xs text-gray-500 hover:text-gray-700">
                Reply
              </button>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        </div>
      )}

      {showReplyBox && (
        <ReplyBox
          postId={postId}
          parentCommentId={comment._id as string}
          onSuccess={(newReply) => setReplies((prev) => [...prev, newReply])}
        />
      )}

      {/* Replies */}
      {replies.map((reply: Comment, idx: number) => (
        <div key={idx} className="ml-12 mt-3">
          <div className="flex items-start gap-2">
            <Avatar>
              <AvatarImage
                src={reply.author.profilePicture || "/images/user.png"}
                alt={reply.author.name}
              />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {reply.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formateDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
