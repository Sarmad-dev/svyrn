import { Separator } from "@/components/ui/separator";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <div className="flex items-center rounded-md overflow-hidden bg-white">
      <p className="px-3 py-2 w-64 md:w-96 text-primary">Search users...</p>
      <div className="p-2">
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:w-2"
        />
        <SearchIcon color="#0D0D0D59" />
      </div>
    </div>
  );
};

export default Search;
