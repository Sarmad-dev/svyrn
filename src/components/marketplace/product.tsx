// ProductDetail.tsx
"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  Star,
  StarHalf,
  StarOff,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReviewToProduct } from "@/lib/actions/product.action";

type Review = {
  reviewer: {
    name: string;
    profilePicture?: string;
  };
  rating: number;
  comment: string;
};

type ProductDetailProps = {
  _id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  seller: {
    name: string;
    profilePicture?: string;
  };
  reviews: Review[];
  isOwner: boolean;
  avgRating: number;
  contact?: {
    email: string;
    phone: string;
  };
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
  _id,
  title,
  description,
  price,
  images,
  seller,
  reviews,
  isOwner,
  avgRating,
  contact,
  location,
}) => {
  const { data: session, isPending } = authClient.useSession();
  const [sliderRef, instanceRef] = useKeenSlider({ loop: true });
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["add-review"],
    mutationFn: async (data: { comment: string; rating: number }) => {
      return await addReviewToProduct({
        token: session?.session.token as string,
        productId: _id as string,
        review: {
          comment: data.comment,
          rating: data.rating,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", _id] });
      setComment("");
      setRating(0);
    },
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await mutateAsync({
        comment,
        rating,
      });
    } catch (error) {
      console.error("Error adding review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-screen mx-auto px-4 md:px-6 py-6 space-y-8 overflow-x-hidden">
      {/* Image Carousel with Buttons */}
      <div className="relative group">
        <div
          ref={sliderRef}
          className="keen-slider rounded-md overflow-hidden shadow w-[300px]">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="keen-slider__slide relative aspect-[4/2.5] max-md:aspect-[4/2]">
              <Image
                src={src}
                alt={`Product ${idx}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 hidden group-hover:block"
          aria-label="Previous Slide">
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 hidden group-hover:block"
          aria-label="Next Slide">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Title, Price & Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ${price.amount}
            </p>
            <p className="text-sm text-gray-500">{price.currency}</p>
          </div>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Seller Info */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg shadow">
        <Avatar>
          <AvatarImage src={seller.profilePicture} />
          <AvatarFallback>{seller.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{seller.name}</p>
          <div className="flex space-x-1 items-center">
            <Mail size={15} />
            {contact?.email ? (
              <p className="text-sm text-gray-500">{contact?.email}</p>
            ) : (
              <p className="text-sm text-gray-500">N/A</p>
            )}
          </div>
          <div className="flex space-x-1 items-center">
            <Phone size={15} />
            {contact?.phone ? (
              <p className="text-sm text-gray-500">{contact?.phone}</p>
            ) : (
              <p className="text-sm text-gray-500">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="p-4 bg-muted rounded-lg shadow">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-gray-900">Location</p>
            {location && (location.address || location.city || location.state || location.country) ? (
              <>
                {location.address && (
                  <p className="text-sm text-gray-600 break-words">{location.address}</p>
                )}
                {[location.city, location.state, location.country].filter(Boolean).length > 0 && (
                  <p className="text-sm text-gray-500">
                    {[location.city, location.state, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {location.coordinates && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      Coordinates: {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => {
                        if (location.coordinates) {
                          const url = `https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}`;
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      View on Map
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No location information available</p>
            )}
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, i) =>
          i + 1 <= avgRating ? (
            <Star key={i} className="text-yellow-500 w-5 h-5 fill-yellow-500" />
          ) : i + 0.5 <= avgRating ? (
            <StarHalf
              key={i}
              className="text-yellow-500 w-5 h-5 fill-yellow-500"
            />
          ) : (
            <StarOff key={i} className="text-yellow-300 w-5 h-5" />
          )
        )}
        <span className="text-sm text-gray-500">
          ({reviews.length} reviews)
        </span>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">User Reviews</h2>
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-muted p-4 rounded-md shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <Avatar>
                <AvatarImage src={review.reviewer.profilePicture} />
                <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.reviewer.name}</p>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review */}
      {!isOwner && (
        <div className="p-6 rounded-md bg-muted border">
          <h2 className="text-lg font-semibold mb-2">Add Your Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer w-6 h-6 ${
                    i < rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <Button type="submit" disabled={isPending || isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
