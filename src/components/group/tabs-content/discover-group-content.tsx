import { GroupCard } from "../group-card";
import { authClient } from "@/lib/auth-client";
import React from "react";
import TabContentHeader from "../tab-content-header";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/actions/group.action";

const DiscoverGroupContent = () => {
  const { data: session, isPending } = authClient.useSession();

  const { data: groups } = useQuery({
    queryKey: ["get-groups"],
    queryFn: async () => {
      return await getGroups({ token: session?.session.token as string });
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2 max-md:px-3">
      <TabContentHeader>
        <div className="space-y-0.5">
          <h2 className="font-medium text-lg max-md:text-[15px]">
            Suggested for you
          </h2>
          <p className="text-muted-foreground text-sm max-md:text-xs">
            Groups you might be interested in
          </p>
        </div>
      </TabContentHeader>
      <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
        {groups?.groups &&
          groups.groups.length > 0 &&
          groups?.groups.map((group) => (
            <GroupCard key={group._id} {...group} />
          ))}
      </div>
    </div>
  );
};

export default DiscoverGroupContent;
