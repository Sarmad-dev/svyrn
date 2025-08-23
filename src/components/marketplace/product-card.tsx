import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Star, StarHalf, StarOff, MapPin } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  _id: string;
  imageUrl: string;
  title: string;
  price: number;
  rating: number; // from 0 to 5
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

const ProductCard = ({
  imageUrl,
  title,
  price,
  rating,
  _id,
  location,
}: ProductCardProps) => {
  return (
    <Link href={`/marketplace/product/${_id}`}>
      <Card className="flex-1 rounded-md overflow-hidden shadow-md bg-white h-fit p-0">
        {/* Product Image */}
        <CardHeader className="sr-only px-0">
          <CardTitle>Product</CardTitle>
          <CardDescription>Product description</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="w-full h-40 relative">
            <Image src={imageUrl} alt={title} fill objectFit="cover" />
          </div>

          {/* Product Details */}
          <div className="p-4">
            <h3 className="text-base font-medium text-gray-900">{title}</h3>

            <div className="flex items-center justify-between mt-2">
              {/* Price */}
              <span className="text-xl font-semibold text-blue-500">
                ${price}
              </span>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) =>
                  i + 1 <= rating ? (
                    <Star
                      key={i}
                      className="text-yellow-500 w-5 h-5 fill-yellow-500"
                    />
                  ) : i + 0.5 <= rating ? (
                    <StarHalf
                      key={i}
                      className="text-yellow-500 w-5 h-5 fill-yellow-500"
                    />
                  ) : (
                    <StarOff key={i} className="text-yellow-300 w-5 h-5" />
                  )
                )}
              </div>
            </div>

            {/* Location */}
            {location && (location.city || location.state || location.country) && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="truncate">
                  {[location.city, location.state, location.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
