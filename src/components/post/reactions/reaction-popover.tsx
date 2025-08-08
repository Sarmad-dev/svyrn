import { useState, useRef, useEffect } from "react";

import React from "react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ThumbsUp } from "lucide-react";

const ReactionPopover = ({
  postId,
  isReacted,
  isReactedType,
}: {
  postId: string;
  isReacted: boolean;
  isReactedType: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    "like" | "love" | "haha" | "wow" | "sad" | "angry" | null
  >(null);

  const { data, isPending } = authClient.useSession();

  const reactionRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionRef.current &&
        !reactionRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isReacted) {
      setSelectedReaction(isReactedType);
    } else {
      setSelectedReaction(null);
    }
  }, [isReactedType, isReacted]);

  const handleReaction = async (name: string) => {
    try {
      await fetch(`${config.apiUrl}/api/posts/${postId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session.token}`,
        },
        body: JSON.stringify({ type: name }),
      });

      toast.success(
        `Reacted with ${reactionsList.find((reaction) => {
          return reaction.name === name && reaction.emoji;
        })}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const reactionsList = [
    { name: "like", emoji: "👍" },
    { name: "love", emoji: "❤️" },
    { name: "haha", emoji: "😂" },
    { name: "wow", emoji: "😮" },
    { name: "sad", emoji: "😢" },
    { name: "angry", emoji: "😡" },
  ];

  return (
    <div className="relative" ref={reactionRef}>
      <Button
        variant="outline"
        size="icon"
        className="border-none cursor-pointer"
        onClick={() => setShowReactions((prev) => !prev)}
        disabled={isPending}>
        <span className="text-xl">
          {selectedReaction ? (
            reactionsList.find((r) => r.name === selectedReaction)?.emoji
          ) : (
            <>
              <ThumbsUp />
            </>
          )}
        </span>
      </Button>

      {showReactions && (
        <div className="absolute bottom-full mb-2 left-24 -translate-x-1/2 bg-white border shadow-md px-2 py-1 rounded-full flex gap-2 z-50 animate-fadeIn">
          {reactionsList.map((reaction) => (
            <button
              key={reaction.name}
              onClick={() => {
                setSelectedReaction(
                  reaction.name as
                    | "like"
                    | "love"
                    | "haha"
                    | "wow"
                    | "sad"
                    | "angry"
                );
                setShowReactions(false);
                handleReaction(reaction.name);
              }}
              className="hover:scale-125 transition-transform text-xl"
              disabled={isPending}>
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPopover;
