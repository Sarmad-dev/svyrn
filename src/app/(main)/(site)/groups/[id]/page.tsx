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
      <div className="flex items-center justify-center w-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="w-full">
      <GroupHeader
        group={{
          isAdmin: group?.isAdmin as boolean,
          isCreator: group?.isCreator as boolean,
          profilePicture: group?.profilePicture,
          coverPhoto: group?.coverPhoto,
        }}
        groupId={id as string}
      />

      <div className="w-full flex items-center justify-center mt-8">
        <AnimatedTabs
          user={currentUser?.user as User}
          group={group as GroupWithPosts}
        />
      </div>
    </main>
  );
};

export default Group;
