"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const AuthBottomSheet = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <div className="bg-blue-500 text-white p-4 w-full cursor-pointer">
          <div className="flex items-center justify-between max-w-md w-full mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex items-center -space-x-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full relative">
                  <Image
                    src="/images/ellipse1.png"
                    alt="logo"
                    fill
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="w-9 h-9 z-50 bg-white/30 rounded-full -ml-2 relative">
                  <Image
                    src="/images/ellipse2.png"
                    alt="logo"
                    fill
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full -ml-2 relative">
                  <Image
                    src="/images/ellipse3.png"
                    alt="logo"
                    fill
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </div>
              <span className="font-medium">Learn about SVRYN</span>
            </div>
            <ChevronUp size={20} />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Bottom Sheet</SheetTitle>
          <SheetDescription>Bottom Sheet Description</SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-between mb-4 bg-blue-500 p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center -space-x-2.5">
                  <div className="w-8 h-8 bg-white/20 rounded-full relative">
                    <Image
                      src="/images/ellipse1.png"
                      alt="logo"
                      fill
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-9 h-9 z-50 bg-white/30 rounded-full -ml-2 relative">
                    <Image
                      src="/images/ellipse2.png"
                      alt="logo"
                      fill
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-full -ml-2 relative">
                    <Image
                      src="/images/ellipse3.png"
                      alt="logo"
                      fill
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <span className="font-medium text-white">
                  Learn about SVRYN
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size={"icon"} className="bg-transparent hover:bg-transparent cursor-pointer border-noner" onClick={() => setIsSheetOpen(false)}>
                  <ChevronDown size={24} className="text-white" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Image
              src="/icons/logo-blue.png"
              alt="logo"
              width={100}
              height={70}
            />
            <p className="text-[#AFC2CF] text-[18px] font-bold mb-2">
              The social network for sovereign beings
            </p>
            <Separator orientation="horizontal" className="my-4 bg-[#AFC2CF]" />
            <p className="text-[#AFC2CF] text-[15px] font-bold">Break free from the algorithm.</p>
            <p className="text-[#AFC2CF] text-[15px] font-bold">Speak freely.</p>
            <p className="text-[#AFC2CF] text-[15px] font-bold">Connect consciously.</p>

            <div className="space-y-4 text-[#000000]/60 my-4 text-[17px] font-medium">
              <p>
                SVRYN is not just another platform - it&apos;s a movement. A
                censorship-resistant space where truth-seekers, healers,
                creatives, and sovereign thinkers gather without fear of
                shadowbans, suppression, or manipulation.
              </p>

              <div>
                <h3 className="text-black mb-2 text-[17px] font-bold">Why SVRYN</h3>
                <ul className="space-y-2 text-[16px] font-medium">
                  <li>
                    • <strong>Unfiltered Expression</strong> – Speak your truth
                    without censorship.
                  </li>
                  <li>
                    • <strong>Interest-Led Feeds</strong> – Your experience is
                    shaped by your vibe, not algorithms.
                  </li>
                  <li>
                    • <strong>Hosted for Freedom</strong> – Our servers honour
                    your rights and privacy.
                  </li>
                  <li>
                    • <strong>Built to Unite</strong> – Created for conscious
                    connection, not division.
                  </li>
                  <li>
                    • <strong>Multi-Realm</strong> – Media, marketplace, groups,
                    pages, soul-aligned commerce
                  </li>
                </ul>
              </div>

              <div className="text-center text-[#AFC2CF] text-[15px] font-semibold space-y-0.5 pt-2">
                <p>
                  This is where the new world begins.
                </p>
                <p>Not a matrix. A mirror.</p>
                <p>For those who came to awaken.</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuthBottomSheet;
