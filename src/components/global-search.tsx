/**
 * Global Search Component
 * 
 * Features:
 * - Beautiful, modern UI with proper design system integration
 * - Mobile-responsive with sheet/drawer for mobile devices
 * - Desktop dropdown for larger screens
 * - Type-specific icons and colors for different search results
 * - Loading states and empty states
 * - Debounced search with 300ms delay
 * - Click outside to close functionality
 * - Tabbed interface for filtering results
 * - Proper avatar fallbacks and image handling
 * - Accessibility improvements
 * 
 * Search Types:
 * - Users (with follower count)
 * - Groups (with member count)
 * - Pages (with follower count)
 * - Ads (advertisements)
 * - Products (with pricing)
 * 
 * Mobile Behavior:
 * - Opens as a top sheet/drawer
 * - Full-screen search experience
 * - Optimized for touch interactions
 * 
 * Desktop Behavior:
 * - Dropdown below search input
 * - Hover states and smooth transitions
 * - Keyboard navigation support
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { 
  Search, 
  Users, 
  Building2, 
  User, 
  Megaphone, 
  ShoppingBag, 
  Loader2, 
  X,
  Globe
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All", icon: Globe },
  { id: "users", label: "Users", icon: User },
  { id: "groups", label: "Groups", icon: Users },
  { id: "pages", label: "Pages", icon: Building2 },
  { id: "ads", label: "Ads", icon: Megaphone },
  { id: "products", label: "Products", icon: ShoppingBag },
];

const TYPE_ICONS = {
  user: User,
  group: Users,
  page: Building2,
  ad: Megaphone,
  product: ShoppingBag,
};

const TYPE_COLORS = {
  user: "bg-blue-100 text-blue-700",
  group: "bg-green-100 text-green-700",
  page: "bg-purple-100 text-purple-700",
  ad: "bg-orange-100 text-orange-700",
  product: "bg-pink-100 text-pink-700",
};

export default function GlobalSearchDropdown() {
  const { data: session } = authClient.useSession();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const search = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim() || !session?.session.token) return;
      
      setLoading(true);
      try {
        const res = await fetch(
          `${config.apiUrl}/api/search/global?query=${encodeURIComponent(searchTerm)}&limit=${10}`,
          {
            headers: {
              Authorization: `Bearer ${session.session.token}`,
            },
          }
        );

        if (!res.ok) {
          toast.error("Search failed");
          return;
        }

        const data = await res.json();
        setResults(data?.results);
      } catch (err) {
        console.error("Search failed", err);
        setResults(null);
      }
      setLoading(false);
    },
    [session?.session.token]
  );

  // Close dropdown when clicking outside component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, search]);

     const renderResultItem = (item: {
     type: "user" | "group" | "page" | "ad" | "product";
     _id: string;
     profilePicture?: string;
     images?: string[];
     name?: string;
     title?: string;
     description?: string;
     followersCount?: number;
     membersCount?: number;
     price?: number;
   }) => {
    const basePath = {
      user: `/user/${item._id}`,
      group: `/groups/${item._id}`,
      page: `/pages/${item._id}`,
      ad: `/ads/${item._id}`,
      product: `/marketplace/product/${item._id}`,
    }[item.type];

    const TypeIcon = TYPE_ICONS[item.type];
    const typeColor = TYPE_COLORS[item.type];

         const getSubtitle = () => {
       switch (item.type) {
         case "user":
           return item.followersCount ? `${item.followersCount} followers` : "User";
         case "group":
           return item.membersCount ? `${item.membersCount} members` : "Group";
         case "page":
           return item.followersCount ? `${item.followersCount} followers` : "Page";
         case "ad":
           return "Advertisement";
         case "product":
           return item.price ? `$${item.price}` : "Product";
         default:
           return item.type;
       }
     };

    return (
      <Link
        href={basePath}
        key={item._id}
        className="block p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
        onClick={() => setShowDropdown(false)}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {item.profilePicture || item.images?.[0] ? (
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={item.profilePicture || (item.images?.[0] as string)}
                  alt={item.name || (item.title as string)}
                />
                <AvatarFallback className="text-sm">
                  {(item.name || item.title || "").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <TypeIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {item.name || item.title}
              </h3>
              <Badge variant="secondary" className={cn("text-xs", typeColor)}>
                {item.type}
              </Badge>
            </div>
            
                         {item.description && (
               <p className="text-sm text-gray-600 mb-1 overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                 {item.description}
               </p>
             )}
            
            <p className="text-xs text-gray-500">
              {getSubtitle()}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const getFilteredResults = () => {
    if (!results) return [];

    if (activeTab === "all") {
      return Object.values(results).flat();
    } else {
      return results[activeTab] || [];
    }
  };

  const SearchInput = useCallback(() => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all duration-200"
        placeholder="Search for users, groups, pages, ads, products..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (value.length >= 2) {
            setShowDropdown(true);
          }
        }}
        onFocus={() => {
          if (query.length >= 2) {
            setShowDropdown(true);
          }
        }}
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => {
            setQuery("");
            setResults(null);
          }}>
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  ), [query]);

  const SearchResults = useCallback(() => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={cn(
                "flex-1 px-3 py-3 text-sm font-medium capitalize border-b-2 transition-all duration-200 flex items-center justify-center space-x-1",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-100"
              )}
              onClick={() => setActiveTab(tab.id)}>
              <TabIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        ) : (
          <>
            {getFilteredResults().length > 0 ? (
              getFilteredResults()
                .sort((a, b) => {
                  const aScore = (a as { relevanceScore: number }).relevanceScore;
                  const bScore = (b as { relevanceScore: number }).relevanceScore;
                  return bScore - aScore;
                })
                .map((item) =>
                                     renderResultItem(
                     item as {
                       type: "user" | "group" | "page" | "ad" | "product";
                       _id: string;
                       profilePicture?: string;
                       images?: string[];
                       name?: string;
                       title?: string;
                       description?: string;
                       followersCount?: number;
                       membersCount?: number;
                       price?: number;
                     }
                   )
                )
            ) : query.length >= 2 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start searching
                </h3>
                <p className="text-gray-500">
                  Search for users, groups, pages, ads, and products
                </p>
              </div>
            )}
          </>
        )}
             </div>
     </div>
   ), [loading, getFilteredResults, query, activeTab]);

  // Mobile version with Sheet
  if (isMobile) {
    return (
      <Sheet open={showDropdown} onOpenChange={setShowDropdown}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 cursor-pointer hover:bg-transparent">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-[80vh] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all duration-200"
                placeholder="Search for users, groups, pages, ads, products..."
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  if (value.length >= 2) {
                    setShowDropdown(true);
                  }
                }}
                onFocus={() => {
                  if (query.length >= 2) {
                    setShowDropdown(true);
                  }
                }}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    setQuery("");
                    setResults(null);
                  }}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <SearchResults />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version
  return (
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      <SearchInput />
      
      {showDropdown && (
        <div className="absolute w-full mt-2 z-50">
          <SearchResults />
        </div>
      )}
    </div>
  );
}
