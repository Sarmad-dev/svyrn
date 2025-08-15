"use client";
import GroupHeader from "@/components/group/groupId/group-header";
import Header from "@/components/layout/header/header";
import { ProfileAnimatedTabs } from "@/components/profile/tabs/profile-animated-tabs";
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const { data: user, isPending: isProfilePending } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(session?.session.token as string),
    enabled: !!session?.session.token,
  });

  if (isPending || isProfilePending)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <main>
      <Header />
      <div className="w-full">
        <div className="container mx-auto px-0 md:px-0">
          <GroupHeader
            userId={user?.id}
            group={{
              isAdmin: true,
              isCreator: true,
              profilePicture: user?.profilePicture,
              coverPhoto: user?.coverPhoto,
              name: user?.name,
            }}
            compact
            noHorizontalPadding
          />

          {/* Tabs anchored directly below header (like Facebook). Name is displayed above the tabs. */}
          <div className="mt-12 max-2xl:mt-10 px-0">
            <ProfileAnimatedTabs user={user as User} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
