"use client";
import GroupHeader from "@/components/group/groupId/group-header";
import { AnimatedTabs } from "@/components/group/groupId/tabs";
import { getGroup } from "@/lib/actions/group.action";
import { getUserProfile } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { GroupWithPosts, User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const Group = () => {
  const { id } = useParams();
  const { data: session, isPending: isUserPending } = authClient.useSession();

  const { data: currentUser, isPending: isDbUserPending } = useQuery({
    queryKey: ["get-user", session?.user.id],
    queryFn: async () =>
      await getUserProfile(
        session?.user.id as string,
        session?.session.token as string
      ),
    enabled: !!session?.user.id && !!session?.session.token, // prevent running too early
  });

  const { data: group, isPending } = useQuery({
    queryKey: ["get-group", id],
    queryFn: async () =>
      await getGroup({
        groupId: id as string,
        token: session?.session.token as string,
      }),
    enabled: !!session?.session.token && !!id,
  });

  if (isPending || isUserPending || isDbUserPending) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <GroupHeader
        group={{
          isAdmin: group?.isAdmin as boolean,
          isCreator: group?.isCreator as boolean,
          profilePicture: group?.profilePicture,
          coverPhoto: group?.coverPhoto,
          name: group?.name,
        }}
        groupId={id as string}
        compact
        noHorizontalPadding
      />

      <div className="container mx-auto px-0 md:px-6 lg:px-8 py-6">
        <div className="w-full md:max-w-4xl md:mx-auto">
          <AnimatedTabs
            user={currentUser?.user as User}
            group={group as GroupWithPosts}
          />
        </div>
      </div>
    </main>
  );
};

export default Group;
