import { Button } from "@/components/ui/button";
import { updateProduct, deleteProduct } from "@/lib/actions/product.action";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";
import DeleteListingDialog from "./delete-listing-dialog";

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  listedDate: Date;
  isSold: boolean;
}

const ListedProductCard = ({
  id,
  title,
  price,
  image,
  listedDate,
  isSold,
}: ListingCardProps) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  console.log("Product ID: ", id);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-sold-status"],
    mutationFn: async (isSold: boolean) =>
      await updateProduct<{ isSold: boolean }>({
        token: session?.session.token as string,
        data: { isSold: isSold },
        productId: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-user-products", session?.user.id],
      });
    },
  });

  const {
    mutateAsync: deleteProductMutation,
    isPending: isDeleteProductPending,
  } = useMutation({
    mutationKey: ["deleteListing"],
    mutationFn: async () =>
      await deleteProduct({
        token: session?.session.token as string,
        productId: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-user-products", session?.user.id],
      });
    },
  });

  const handleUpdateSold = async () => {
    if (isSold) {
      await mutateAsync(false);
    } else {
      await mutateAsync(true);
    }
  };

  const handleDeleteListing = async () => {
    await deleteProductMutation();
  };

  return (
    <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          className="hover:scale-105 transition-transform duration-300"
          fill
          objectFit="cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
          {title}
        </h3>

        {/* Price and Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-[#4eaae9]">${price}</span>
          <span className="text-sm text-gray-500">
            listed on {listedDate.getDate()}/{listedDate.getMonth()}/
            {listedDate.getFullYear()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleUpdateSold}
            variant="outline"
            className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 py-2 text-sm"
            disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isSold ? (
              "Mark as available"
            ) : (
              "Mark as sold"
            )}
          </Button>
          <DeleteListingDialog onDelete={handleDeleteListing}>
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-300 hover:bg-red-50 py-2 text-sm flex items-center justify-center gap-2">
              {isDeleteProductPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {" "}
                  <Trash2Icon />
                  Delete listing
                </>
              )}
            </Button>
          </DeleteListingDialog>
        </div>
      </div>
    </div>
  );
};

export default ListedProductCard;
