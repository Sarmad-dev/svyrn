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
  const [locationQuery, setLocationQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [limit] = React.useState<number>(12); // Products per page

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", searchQuery, locationQuery, currentPage, limit],
    queryFn: async () =>
      await getProducts({
        token: session?.session.token as string,
        search: searchQuery,
        location: locationQuery,
        page: currentPage,
        limit: limit,
      }),
    enabled: !!session?.session.token,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  };

  // Reset to page 1 when search query or location query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="w-full flex items-center justify-between max-md:px-3 max-md:mt-2">
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
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mt-5 max-md:px-3">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products"
          className="flex-1 outline-gray-700"
        />
        <Input
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="Search by location"
          className="flex-1 outline-gray-700"
        />
      </div>
      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-5 mt-5 max-md:px-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 mt-5 max-md:px-3">
            {products.map((product: ProductCardType) => (
              <ProductCard
                _id={product._id}
                key={product._id}
                price={product.price.amount}
                imageUrl={product.images[0]}
                rating={product.averageRating}
                title={product.title}
                location={product.location}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 mb-6 max-md:px-3">
              {/* Previous Button */}
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <Button
                      onClick={() => handlePageChange(1)}
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10"
                    >
                      1
                    </Button>
                    {currentPage > 4 && (
                      <span className="text-gray-500 dark:text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* Current page and adjacent pages */}
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.pages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNumber = pagination.pages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  if (pageNumber < 1 || pageNumber > pagination.pages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                {/* Last page */}
                {currentPage < pagination.pages - 2 && (
                  <>
                    {currentPage < pagination.pages - 3 && (
                      <span className="text-gray-500 dark:text-gray-400">...</span>
                    )}
                    <Button
                      onClick={() => handlePageChange(pagination.pages)}
                      variant={currentPage === pagination.pages ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10"
                    >
                      {pagination.pages}
                    </Button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          )}

          {/* Page Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, pagination.total)} of {pagination.total} products
          </div>
        </>
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
    </>
  );
};

export default Marketplace;
