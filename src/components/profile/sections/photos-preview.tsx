"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

type PhotosPreviewProps = {
  photos: {
    url: string;
    _id: string;
    createdAt: string;
  }[];
};

export default function PhotosPreview({ photos }: PhotosPreviewProps) {
  const items = photos.slice(0, 9);
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-lg font-semibold">Photos</h3>
        <Link href="/profile" className="text-blue-500 text-sm">
          See All Photos
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-1 p-2">
        {items.map((src, i) => (
          <Dialog key={i}>
            <DialogTrigger asChild>
              <button className="relative w-full pt-[100%] overflow-hidden rounded">
                <Image
                  src={src.url}
                  alt={`photo-${i}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 33vw, 100px"
                  className="object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent
              className="p-0 bg-black/90 border-none shadow-none max-w-none w-screen h-[100dvh] top-0 left-0 translate-x-0 translate-y-0 flex items-center justify-center"
              showCloseButton
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Photo</DialogTitle>
                <DialogDescription>User Photos</DialogDescription>
              </DialogHeader>
              <div className="relative w-[96vw] md:w-[90vw] max-w-4xl h-[80dvh] md:h-[85vh]">
                <Image
                  src={src.url}
                  alt={`photo-${i}`}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground px-4 pb-4">
            No photos yet
          </div>
        )}
      </div>
    </div>
  );
}
