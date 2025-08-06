"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const TABS = ["all", "users", "groups", "pages", "ads", "products"];

export default function GlobalSearchDropdown() {
  const { data: session } = authClient.useSession();
  const wrapperRef = useRef<HTMLDivElement>(null); // NEW
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const search = useCallback(
    async (searchTerm: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.apiUrl}/api/search/global?query=${searchTerm}&limit=${5}`,
          {
            headers: {
              Authorization: `Bearer ${session?.session.token}`,
            },
          }
        );

        if (!res.ok) {
          toast.error("Search failed");
          return;
        }

        const results = await res.json();

        setResults(results?.results);
      } catch (err) {
        console.error("Search failed", err);
        setResults(null);
      }
      setLoading(false);
    },
    [session?.session.token]
  );

  // ✅ Close dropdown when clicking outside component
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
    profilePicture: string;
    images?: string[];
    name?: string;
    title?: string;
  }) => {
    const basePath = {
      user: `/user/${item._id}`,
      group: `/groups/${item._id}`,
      page: `/pages/${item._id}`,
      ad: `/ads/${item._id}`,
      product: `/marketplace/product/${item._id}`,
    }[item.type];

    return (
      <Link
        href={basePath}
        key={item._id}
        className="block px-4 py-2 hover:bg-gray-100">
        <div className="flex items-center space-x-2">
          {item.profilePicture || item.images?.[0] ? (
            <div className="relative h-8 w-8">
              <Image
                src={item.profilePicture || (item.images?.[0] as string)}
                alt={item.name || (item.title as string)}
                fill
                className="rounded-full"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.name || item.title}
            </p>
            <p className="text-xs text-gray-500">{item.type}</p>
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

  return (
    <div className="relative w-xl max-w-2xl" ref={wrapperRef}>
      <input
        type="text"
        className="w-full border rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for users, groups, pages, etc..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && (
        <div className="absolute w-full bg-white shadow-lg border rounded-md mt-2 max-h-[480px] overflow-hidden z-50">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-3 py-2 text-sm font-medium capitalize border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Results */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Searching...</div>
            ) : (
              <>
                {getFilteredResults().length > 0 ? (
                  getFilteredResults()
                    .sort((a, b) => {
                      const aScore = (a as { relevanceScore: number })
                        .relevanceScore;
                      const bScore = (b as { relevanceScore: number })
                        .relevanceScore;
                      return bScore - aScore;
                    })
                    .map((item) =>
                      renderResultItem(
                        item as {
                          type: "user" | "group" | "page" | "ad" | "product";
                          _id: string;
                          profilePicture: string;
                          images?: string[];
                          name?: string;
                          title?: string;
                        }
                      )
                    )
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
