/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { X, Heart, MessageCircle, Send, ChevronUp, Eye } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { config } from "@/lib/config";

type Story = {
  id: string | number;
  type: "image" | "video";
  url: string;
  name: string;
  avatarUrl: string;
  caption: string;
  storyId?: string;
  authorId?: string;
  duration?: number;
};

type Props = {
  stories: Story[];
  onClose: () => void;
};

const reactionEmojis = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😡", label: "Angry" },
];

export const StoryViewer = ({ stories, onClose }: Props) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(20000); // default 20s
  const [commentText, setCommentText] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const { data: sessionData } = authClient.useSession();

  const currentStory = stories[currentIndex];
  const isOwnStory = currentStory?.authorId === sessionData?.user.id;

  // Fetch story interactions (for own stories)
  const { data: interactions } = useQuery({
    queryKey: ["storyInteractions", currentStory?.storyId],
    queryFn: async () => {
      if (!isOwnStory || !currentStory?.storyId) {
        console.log("[DEBUG] Story interactions query disabled:", {
          isOwnStory,
          storyId: currentStory?.storyId,
        });
        return null;
      }

      console.log(
        "[DEBUG] Fetching story interactions for:",
        currentStory.storyId
      );

      const response = await fetch(
        `${config.apiUrl}/api/stories/${currentStory.storyId}/interactions`,
        {
          headers: { Authorization: `Bearer ${sessionData?.session.token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("[DEBUG] Story interactions response:", data);
        return data.data;
      }
      console.log(
        "[DEBUG] Story interactions response not ok:",
        response.status
      );
      return null;
    },
    enabled:
      isOwnStory && !!currentStory?.storyId && !!sessionData?.session.token,
  });

  // React to story mutation
  const reactMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      if (!currentStory?.storyId) {
        throw new Error("Story ID is required");
      }

      const response = await fetch(
        `${config.apiUrl}/api/stories/${currentStory.storyId}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData?.session.token}`,
          },
          body: JSON.stringify({ type: reactionType }),
        }
      );
      if (!response.ok) throw new Error("Failed to react");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyInteractions"] });
      queryClient.invalidateQueries({ queryKey: ["getStories"] });
    },
  });

  // Comment on story mutation
  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!currentStory?.storyId) {
        throw new Error("Story ID is required");
      }

      const response = await fetch(
        `${config.apiUrl}/api/stories/${currentStory.storyId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData?.session.token}`,
          },
          body: JSON.stringify({ text }),
        }
      );
      if (!response.ok) throw new Error("Failed to comment");
      return response.json();
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["storyInteractions"] });
      queryClient.invalidateQueries({ queryKey: ["getStories"] });
    },
  });

  // Handle image or video duration setup
  useEffect(() => {
    if (currentStory?.type === "image") {
      setDuration(currentStory.duration ? currentStory.duration * 1000 : 5000);
    }
    setProgress(0);
  }, [currentStory]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose]);

  // Handle progress bar animation
  useEffect(() => {
    if (currentStory.type === "video" && !duration) return;

    const updateInterval = 100;
    const steps = duration / updateInterval;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          handleNext();
          return 100;
        }
        return prev + 100 / steps;
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, currentStory, handleNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const third = window.innerWidth / 2;
    if (e.clientX > third) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleVideoMetadata = () => {
    if (videoRef.current?.duration) {
      setDuration(videoRef.current.duration * 1000); // convert to ms
    }
  };

  const handleReaction = (reactionType: string) => {
    console.log("[DEBUG] handleReaction called:", {
      reactionType,
      currentStory,
    });

    if (!isOwnStory) {
      if (!currentStory?.storyId) {
        console.error("[DEBUG] Cannot react: storyId is missing", currentStory);
        return;
      }
      reactMutation.mutate(reactionType);
    }
  };

  const handleComment = () => {
    console.log("[DEBUG] handleComment called:", { commentText, currentStory });

    if (commentText.trim() && !isOwnStory) {
      if (!currentStory?.storyId) {
        console.error(
          "[DEBUG] Cannot comment: storyId is missing",
          currentStory
        );
        return;
      }
      commentMutation.mutate(commentText.trim());
    }
  };

  
  // Early return if currentStory is undefined
  if (!currentStory) {
    console.log("[DEBUG] Early return - currentStory is undefined:", {
      currentIndex,
      stories,
    });
    return null;
  }

  // Validate currentStory has required fields
  if (!currentStory.storyId || !currentStory.type || !currentStory.url) {
    console.error(
      "[DEBUG] currentStory missing required fields:",
      currentStory
    );
    return null;
  }

  // Validate currentIndex
  if (currentIndex < 0 || currentIndex > stories.length) {
    console.error("[DEBUG] Invalid currentIndex:", {
      currentIndex,
      storiesLength: stories.length,
    });
    return null;
  }

  // Early return if currentStory is undefined (after all hooks)
  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Progress Indicators */}
      <div className="absolute top-0 left-0 w-full flex gap-1 px-4 py-3 z-20">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-white to-gray-200 transition-all duration-100 linear"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/60 to-transparent pt-12 pb-6">
        <div className="flex items-center justify-between px-4">
          {/* User Info */}
          <div className="flex items-center gap-3 text-white">
            <div className="relative w-10 h-10 rounded-full border-2 border-white/50">
              <Image
                src={currentStory?.avatarUrl || "/images/user.png"}
                alt={currentStory?.name || "User"}
                className="rounded-full object-cover"
                fill
              />
            </div>
            <div>
              <span className="text-sm font-semibold">
                {currentStory?.name}
              </span>
              <div className="text-xs text-white/80">2h ago</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Own Story Stats */}
            {isOwnStory && interactions && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>
                    {interactions.reactionsCount + interactions.commentsCount}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex items-center justify-center w-full relative"
        onClick={handleTap}
      >
        {/* Media */}
        {currentStory?.type === "image" ? (
          <div className="h-[70vh] max-md:h-[60vh] max-md:w-[calc(100vw-40px)] w-[400px] relative rounded-2xl overflow-hidden">
            <Image
              src={currentStory?.url || ""}
              alt="story"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            key={currentStory?.id}
            src={currentStory?.url}
            autoPlay
            muted
            playsInline
            onLoadedMetadata={handleVideoMetadata}
            onEnded={handleNext}
            className="max-h-[70vh] h-[70vh] max-w-full w-[400px] max-md:w-[calc(100vw-40px)] object-cover rounded-2xl"
          />
        )}

        {/* Caption */}
        {currentStory?.caption && (
          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-lg font-medium drop-shadow-lg bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-8">
        <div className="px-4">
          {!isOwnStory ? (
            /* Interaction Controls for Others' Stories */
            <div className="space-y-3">
              {/* Quick Reactions Row */}
              <div className="flex items-center justify-center gap-2">
                {reactionEmojis.slice(0, 6).map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
                    className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110"
                    title={reaction.label}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                  </button>
                ))}
              </div>

              {/* Comment Input - Full Width */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 relative">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Send a message..."
                    className="bg-white/20 backdrop-blur-md border-none text-white placeholder-white/70 rounded-2xl resize-none h-12 px-6 py-3 w-full text-base"
                    maxLength={500}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleComment();
                      }
                    }}
                  />
                  {/* Character counter */}
                  {commentText.length > 400 && (
                    <div className="absolute bottom-1 right-3 text-xs text-white/60">
                      {500 - commentText.length}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 rounded-full transition-all duration-200 hover:scale-105 disabled:scale-100"
                >
                  {commentMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Statistics for Own Stories */
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {interactions && (
                        <>
                          <div className="flex items-center gap-2 text-white">
                            <Eye className="w-5 h-5" />
                            <span className="font-semibold">
                              {interactions.reactionsCount +
                                interactions.commentsCount}
                            </span>
                            <span className="text-sm text-white/80">views</span>
                          </div>
                          {interactions.reactionsCount > 0 && (
                            <div className="flex items-center gap-2 text-white">
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                              <span className="font-semibold">
                                {interactions.reactionsCount}
                              </span>
                            </div>
                          )}
                          {interactions.commentsCount > 0 && (
                            <div className="flex items-center gap-2 text-white">
                              <MessageCircle className="w-5 h-5" />
                              <span className="font-semibold">
                                {interactions.commentsCount}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <ChevronUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="h-[70vh] rounded-t-3xl bg-white dark:bg-gray-900"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Interactions</SheetTitle>
                  <SheetDescription>Interactions</SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <h3 className="text-lg font-semibold mb-6">Story Activity</h3>

                  {interactions && (
                    <div className="space-y-6">
                      {/* Reactions */}
                      {interactions.reactions?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            Reactions ({interactions.reactionsCount})
                          </h4>
                          <div className="space-y-2">
                            {interactions.reactions.map((reaction: any) => (
                              <div
                                key={reaction._id}
                                className="flex items-center gap-3"
                              >
                                <Image
                                  src={
                                    reaction.user.profilePicture ||
                                    "/images/user.png"
                                  }
                                  alt={reaction.user.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <span className="flex-1">
                                  {reaction.user.name}
                                </span>
                                <span className="text-2xl">
                                  {
                                    reactionEmojis.find(
                                      (e) => e.type === reaction.type
                                    )?.emoji
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      {interactions.comments?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Comments ({interactions.commentsCount})
                          </h4>
                          <div className="space-y-3">
                            {interactions.comments.map((comment: any) => (
                              <div key={comment._id} className="flex gap-3">
                                <Image
                                  src={
                                    comment.user.profilePicture ||
                                    "/images/user.png"
                                  }
                                  alt={comment.user.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                    <div className="font-medium text-sm">
                                      {comment.user.name}
                                    </div>
                                    <div className="text-sm">
                                      {comment.text}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};
