import Image from "next/image";
import { Button } from "../ui/button";

interface AdCardProps {
  title: string;
  price: string;
  image: string;
  listedDate: Date;
}

const AdCard: React.FC<AdCardProps> = ({ title, price, image, listedDate }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="h-40 relative bg-gray-200 overflow-hidden">
        <Image src={image} alt={title} fill objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-[#4eaae9]">${price}</span>
          <span className="text-sm text-gray-500">
            listed on {new Date(listedDate).getDate()}/
            {new Date(listedDate).getMonth()}
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full text-gray-600 border-gray-300 hover:bg-gray-50">
          🗑️ Delete Ads
        </Button>
      </div>
    </div>
  );
};

export default AdCard;
