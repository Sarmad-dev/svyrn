import Image from "next/image";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface JoinedGroupProps {
  name: string;
  image: string;
  lastVisit: string;
  groupId: string;
}

const JoinedGroupCard: React.FC<JoinedGroupProps> = ({
  name,
  image,
  lastVisit,
  groupId,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      {/* Group image */}

      <div className="flex gap-2 items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
          <Image src={image} alt={name} fill objectFit="contain" />
        </div>

        {/* Group info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{lastVisit}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-2">
        <Link href={`/groups/${groupId}`}>
          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 cursor-pointer">
            View group
          </Button>
        </Link>
        <button className="text-gray-400 hover:text-red-500 p-2">
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default JoinedGroupCard;
