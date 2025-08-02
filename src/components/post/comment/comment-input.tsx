import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/config";
import { Comment } from "@/types/global";
import React, { useState } from "react";
import { toast } from "sonner";

const CommentInput = ({
  postId,
  onSuccess,
}: {
  postId: string;
  onSuccess?: (newComment: Comment) => void;
}) => {
  const { data, isPending } = authClient.useSession();
  const [commentValue, setCommentValue] = useState("");

  const handleAddComment = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session.token}`,
        },
        body: JSON.stringify({
          content: commentValue,
        }),
      });

      const response = await res.json();
      if (response.status === "success") {
        onSuccess?.(response.data.comment);
        setCommentValue("");
      }

      toast.success("Comment added");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex-1 flex items-center gap-2">
      <input
        type="text"
        placeholder="Message"
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddComment();
          }
        }}
        disabled={isPending}
      />
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
      <button className="text-gray-400 hover:text-gray-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
        </svg>
      </button>
    </div>
  );
};

export default CommentInput;
