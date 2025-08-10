"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
                <Image src="/images/ellipse1.png" alt="logo" fill objectFit="cover" className="rounded-full" />
              </div>
              <div className="w-9 h-9 z-50 bg-white/30 rounded-full -ml-2 relative">
                <Image src="/images/ellipse2.png" alt="logo" fill objectFit="cover" className="rounded-full" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full -ml-2 relative">
                <Image src="/images/ellipse3.png" alt="logo" fill objectFit="cover" className="rounded-full" />
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
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-300 rounded-full -ml-2"></div>
              <div className="w-8 h-8 bg-blue-200 rounded-full -ml-2"></div>
            </div>
            <button onClick={() => setIsSheetOpen(false)}>
              <ChevronDown size={24} className="text-gray-400" />
            </button>
          </div>
          <h2 className="text-4xl font-light text-blue-500 mb-2">SVRYN</h2>
          <p className="text-gray-600 text-lg mb-2">The social network for sovereign beings</p>
          <p className="text-gray-500">Break free from the algorithm.</p>
          <p className="text-gray-500">Speak freely.</p>
          <p className="text-gray-500">Connect consciously.</p>
        </div>

        <div className="space-y-4 text-gray-700">
          <p>
            SVRYN is not just another platform - it's a movement. A censorship-resistant space 
            where truth-seekers, healers, creatives, and sovereign thinkers gather without fear of 
            shadowbans, suppression, or manipulation.
          </p>

          <div>
            <h3 className="font-semibold text-black mb-2">Why SVRYN</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Unfiltered Expression</strong> – Speak your truth without censorship.</li>
              <li>• <strong>Interest-Led Feeds</strong> – Your experience is shaped by your vibe, not algorithms.</li>
              <li>• <strong>Hosted for Freedom</strong> – Our servers honour your rights and privacy.</li>
              <li>• <strong>Built to Unite</strong> – Created for conscious connection, not division.</li>
              <li>• <strong>Multi-Realm</strong> – Media, marketplace, groups, pages, soul-aligned commerce</li>
            </ul>
          </div>

          <div className="text-center text-gray-500 space-y-1 pt-4">
            <p className="font-medium">This is where the new world begins.</p>
            <p>Not a matrix. A mirror.</p>
            <p>For those who came to awaken.</p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
  )
}

export default AuthBottomSheet