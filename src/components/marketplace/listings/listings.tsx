/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserProducts } from "@/lib/actions/product.action";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ListedProductCard from "./listed-product-card";
import CreateProductDialog from "../create-product-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const UserListings = () => {
  const { data: session, isPending: isUserPending } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isPending } = useQuery({
    queryKey: ["get-user-products", session?.user.id, searchTerm],
    queryFn: async () =>
      await getUserProducts({
        token: session?.session.token as string,
        userId: session?.user.id as string,
        search: searchTerm as string,
      }),
    enabled: !!session?.session.token,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6 max-md:px-3">
        <h1 className="text-2xl font-bold text-gray-900">Your listings</h1>
        <CreateProductDialog>
          <Button className="bg-[#4eaae9] hover:bg-[#3d8bc4] text-white">
            <Plus /> Create new listings
          </Button>
        </CreateProductDialog>
      </div>
      {/* Search Bar */}
      <div className="flex gap-4 mb-8 max-md:px-3">
        <Input
          placeholder="Search your listings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>
      {(isPending || isUserPending) && (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-5 max-md:px-3">
          {products.map((product: any) => (
            <ListedProductCard
              id={product._id}
              image={product.images[0]}
              title={product.title}
              price={product.price.amount}
              listedDate={new Date(product.createdAt)}
              isSold={product.isSold}
              key={product._id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="text-xl font-semibold">No Products found</h3>
          <CreateProductDialog>
            <Button className="bg-[#4eaae9] hover:bg-[#3d8bc4] text-white">
              <Plus /> Create new listings
            </Button>
          </CreateProductDialog>
        </div>
      )}
    </>
  );
};

export default UserListings;
