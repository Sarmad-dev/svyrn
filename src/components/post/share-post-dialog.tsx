/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MessageSquare, Users } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUserGroups } from "@/lib/actions/group.action";
import { getConversations } from "@/lib/actions/conversation.action";
import { sharePost } from "@/lib/actions/post.action";
import { toast } from "sonner";

interface SharePostDialogProps {
  postId: string;
  trigger: React.ReactNode;
}

export const SharePostDialog: React.FC<SharePostDialogProps> = ({ postId, trigger }) => {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [shareDest, setShareDest] = useState<"feed" | "group" | "conversation">("feed");
  const [shareCaption, setShareCaption] = useState("");
  const [targetGroupId, setTargetGroupId] = useState<string>("");
  const [targetConversationId, setTargetConversationId] = useState<string>("");

  const { data: userGroups, isLoading: isLoadingGroups, error: groupsError } = useQuery({
    queryKey: ["user-groups"],
    queryFn: () => getUserGroups({ token: session?.session.token as string }),
    enabled: !!session?.session.token && open,
  });

  const { data: conversationsData, isLoading: isLoadingConversations, error: conversationsError } = useQuery({
    queryKey: ["user-conversations"],
    queryFn: () =>
      getConversations({
        token: session?.session.token as string,
        page: 1,
        limit: 50,
      }),
    enabled: !!session?.session.token && open,
  });

  const shareMutation = useMutation({
    mutationKey: ["share-post", postId],
    mutationFn: async () =>
      await sharePost({
        token: session?.session.token as string,
        postId,
        destination: shareDest,
        caption: shareCaption,
        groupId: shareDest === "group" ? targetGroupId : undefined,
        conversationId: shareDest === "conversation" ? targetConversationId : undefined,
      }),
    onSuccess: () => {
      setOpen(false);
      resetForm();
      toast.success("Post shared successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to share post. Please try again.";
      toast.error(errorMessage);
      console.error("Share error:", error);
    },
  });

  const handleShare = () => {
    if (shareDest === "group" && !targetGroupId) {
      toast.error("Please select a group to share to");
      return;
    }
    if (shareDest === "conversation" && !targetConversationId) {
      toast.error("Please select a conversation to share to");
      return;
    }

    if (shareDest === "group" && (!userGroups || (userGroups as any[]).length === 0)) {
      toast.error("No groups available to share to");
      return;
    }
    if (
      shareDest === "conversation" &&
      (!conversationsData || !conversationsData.conversations || conversationsData.conversations.length === 0)
    ) {
      toast.error("No conversations available to share to");
      return;
    }

    shareMutation.mutate();
  };

  const resetForm = () => {
    setShareDest("feed");
    setShareCaption("");
    setTargetGroupId("");
    setTargetConversationId("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-6 max-w-md mx-auto">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">Share Post</DialogTitle>
          <p className="text-gray-500 mt-2">Choose where you&apos;d like to share this post</p>
        </DialogHeader>

        <div className="space-y-6">
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

          {shareDest === "group" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Group:</label>
              {!isLoadingGroups && !groupsError && userGroups && (userGroups as any[]).length === 0 && (
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
                    <div className="p-3 text-center text-red-500">Failed to load groups</div>
                  ) : userGroups && (userGroups as any[]).length > 0 ? (
                    (userGroups as any[]).map((group: any) => (
                      <SelectItem key={group._id} value={group._id} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-500" />
                          <span>{group.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No groups available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {shareDest === "conversation" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Conversation:</label>
              {!isLoadingConversations &&
                !conversationsError &&
                conversationsData &&
                (!conversationsData.conversations || conversationsData.conversations.length === 0) && (
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
                    <div className="p-3 text-center text-red-500">Failed to load conversations</div>
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
                                : "Conversation")}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No conversations available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add a caption (optional):</label>
            <Textarea
              placeholder="What's on your mind about this post?"
              value={shareCaption}
              onChange={(e) => setShareCaption(e.target.value)}
              className="min-h-[100px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">{shareCaption.length}/500</div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-200 hover:border-gray-300"
              onClick={resetForm}
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
                (shareDest === "group" && (!userGroups || (userGroups as any[]).length === 0)) ||
                (shareDest === "conversation" &&
                  (!conversationsData || !conversationsData.conversations || conversationsData.conversations.length === 0))
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
                  Share Post
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


