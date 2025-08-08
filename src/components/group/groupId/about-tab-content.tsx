import { GroupWithPosts } from "@/types/global";
import Image from "next/image";
import React from "react";
import GroupRulesDialog from "./group-rules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutTabContent = ({ group }: { group: GroupWithPosts }) => {
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "🌍";
      case "private":
        return "🔒";
      case "secret":
        return "㊙️";
      default:
        return "🌍";
    }
  };

  const getPrivacyText = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      case "secret":
        return "Secret";
      default:
        return "Public";
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Info Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              About {group.name}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{getPrivacyIcon(group.privacy)}</span>
              <span>{getPrivacyText(group.privacy)}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{group.description}</p>
          </div>

          {/* Creator */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Creator</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Image
                src={group.creator.profilePicture || "/images/user.png"}
                alt="creator"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {group.creator.name}
                </p>
                <p className="text-sm text-gray-500">Group Creator</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              Group Rules
            </CardTitle>
            {(group.isAdmin || group.isCreator) && (
              <GroupRulesDialog group={group} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {group.rules.length > 0 ? (
            <div className="space-y-4">
              {group.rules.map((rule, index) => (
                <div key={rule.title} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {rule.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No rules yet
              </h3>
              <p className="text-gray-500 text-sm">
                Group rules will appear here when added
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutTabContent;
