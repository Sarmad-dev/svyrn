import { GroupWithPosts } from "@/types/global";
import Image from "next/image";
import React from "react";
import GroupRulesDialog from "./group-rules";

const AboutTabContent = ({ group }: { group: GroupWithPosts }) => {
  return (
    <div className="space-y-2 mt-3">
      <div className="space-y-0.50.5">
        <h2 className="font-semibold text-xl">About this {group.name}</h2>
        <div className="">
          {group.privacy === "public"
            ? "🌍 Public"
            : group.privacy === "private"
            ? "🔒 Private"
            : "㊙️ Secret"}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Description</h3>
          <p>{group.description}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">Creator</h3>

          <div className="rounded-md bg-background/10 w-fit flex px-2 py-1 gap-2 items-center">
            <Image
              src={group.creator.profilePicture || "/images/user.png"}
              alt="user"
              width={30}
              height={30}
              className="rounded-full"
            />
            <p>{group.creator.name}</p>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-xl">Rules</h3>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              {group.rules.length > 0 ? (
                <>
                  {group.rules.map((rule) => {
                    return (
                      <div className="space-y-0.5" key={rule.title}>
                        <h4 className="text-lg font-medium">{rule.title}</h4>
                        <p>{rule.description}</p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p>No rules yet</p>
              )}
            </div>
            {(group.isAdmin || group.isCreator) && (
              <GroupRulesDialog group={group} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTabContent;
