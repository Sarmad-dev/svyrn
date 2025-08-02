"use client";
import CreateProductDialog from "@/components/marketplace/create-product-dialog";
import ProductCard from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/actions/product.action";
import { authClient } from "@/lib/auth-client";
import { ProductCard as ProductCardType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Marketplace = () => {
  const { data: session } = authClient.useSession();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: products } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () =>
      await getProducts({
        token: session?.session.token as string,
        search: searchQuery,
      }),
    enabled: !!session?.session.token,
  });

  return (
    <div>
      <div className="w-full flex items-center justify-between max-md:px-3">
        <h2 className="font-semibold text-lg">Marketplace</h2>
        <div className="flex gap-x-2">
          <Link
            href={`/marketplace/${session?.user.id}`}
            className="bg-[#4EAAE9] text-white rounded-md p-2">
            <Image src={"/icons/shop.svg"} alt="shop" width={20} height={20} />
          </Link>
          <CreateProductDialog>
            <Button className="bg-[#4EAAE9] hover:bg-[#4EAAE9]/90 text-white w-[170px]">
              <Plus />
              Sell Something
            </Button>
          </CreateProductDialog>
        </div>
      </div>
      <div className="flex gap-5 items-center mt-5 max-md:px-3">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products"
          className="flex-1 outline-gray-700"
        />
      </div>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-5 mt-5 max-md:px-3">
          {products.map((product: ProductCardType) => (
            <ProductCard
              _id={product._id}
              key={product._id}
              price={product.price.amount}
              imageUrl={product.images[0]}
              rating={product.averageRating}
              title={product.title}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center mt-3">
          <h2 className="text-xl font-semibold">No Product found</h2>
          <CreateProductDialog>
            <Button className="bg-[#4EAAE9] hover:bg-[#4EAAE9]/90 text-white w-[170px]">
              <Plus />
              Sell Something
            </Button>
          </CreateProductDialog>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
