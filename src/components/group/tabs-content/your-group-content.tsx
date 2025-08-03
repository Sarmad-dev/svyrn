/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import TabContentHeader from "../tab-content-header";
import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";
import JoinedGroupCard from "../joined-group-card";

const YourGroupsContent = () => {
  const { data: session } = authClient.useSession();
  const token = session?.session.token as string;
  const { data: groups } = useQuery({
    queryKey: ["get-user-groups"],
    queryFn: async () => await getUserGroups({ token }),
  });
  return (
    <div className="space-y-2 max-md:px-3">
      <TabContentHeader>
        <div className="space-y-0.5">
          <h2 className="font-medium text-lg max-md:text-sm">
            All groups you&apos;ve joined
          </h2>
        </div>
      </TabContentHeader>
      <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
        {groups &&
          groups.length > 0 &&
          groups.map((group: any) => (
            <JoinedGroupCard
              image={group.profilePicture}
              lastVisit={group.lastVisit}
              name={group.name}
              key={group._id}
              groupId={group._id}
            />
          ))}
      </div>
    </div>
  );
};

export default YourGroupsContent;
