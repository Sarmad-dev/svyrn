/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, SearchIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchUsers } from "@/lib/actions/user.action";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { createConversation } from "@/lib/actions/conversation.action";

const AddChatDialog = () => {
  const { data, isPending } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useQueryState("conversationId");

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["search-users", searchTerm],
    queryFn: async () =>
      await searchUsers({
        token: data?.session.token as string,
        search: searchTerm,
      }),
    enabled: !!data?.session.token && !!searchTerm && searchTerm.length > 1,
  });

  const { mutateAsync, isPending: isConversationCreationPending } = useMutation(
    {
      mutationKey: ["create-conversation"],
      mutationFn: async (participantId: string) =>
        await createConversation({
          token: data?.session.token as string,
          data: {
            type: "direct",
            name: "New Conversation",
            description: "New Conversation",
            participants: [participantId],
          },
        }),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["get-conversations"] });
        setConversationId(data._id);
        setIsOpen(false);
      },
    }
  );

  const handleAddChat = async (participantId: string) => {
    await mutateAsync(participantId);
  };

  const users = userData?.users;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4eaae9] hover:bg-[#3d8bc4] text-white px-4 py-2 text-sm">
          CHAT +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search User and start conversation
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border border-gray-400 rounded-md px-2">
          <Input
            type="text"
            className="w-full p-2 outline-none border-none focus-visible:ring-0"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isPending || isConversationCreationPending}
          />
          <SearchIcon className="text-gray-400" />
        </div>
        <ScrollArea className="w-full h-fit max-h-96">
          {isUserDataPending ? (
            <div className="w-full flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {users &&
                users.length > 0 &&
                users.map((user: any) => (
                  <div
                    className="cursor-pointer w-full rounded-md bg-gray-200 px-2 py-1 flex items-center gap-2"
                    key={user._id}
                    aria-label="button"
                    role="button"
                    onClick={() => handleAddChat(user._id)}>
                    <div className="w-[40px] h-[40px] rounded-full relative">
                      <Image
                        src={user.profilePicture || "/images/user.png"}
                        alt="user picture"
                        fill
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                ))}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddChatDialog;
