// components/post/comment/ReplyBox.tsx
import { useState } from "react";
import { Comment } from "@/types/global";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/config";

export default function ReplyBox({
  postId,
  parentCommentId,
  onSuccess,
}: {
  postId: string;
  parentCommentId: string;
  onSuccess?: (newComment: Comment) => void;
}) {
  const { data: session } = authClient.useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.session.token}`,
        },
        body: JSON.stringify({ content, parentComment: parentCommentId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onSuccess?.(data.data.comment);
        setContent("");
      }
    } catch (e) {
      console.error("Error adding reply", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-start mt-2 ml-12">
      <textarea
        className="border p-2 rounded-md w-full text-sm"
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
      />
      <button
        className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md disabled:opacity-50"
        disabled={loading}
        onClick={handleReply}>
        Reply
      </button>
    </div>
  );
}
