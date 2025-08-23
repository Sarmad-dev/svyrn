"use client";
import { ProductDetail } from "@/components/marketplace/product";
import { getProduct } from "@/lib/actions/product.action";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const ProductPage = () => {
  const { id } = useParams();
  const { data: session, isPending } = authClient.useSession();

  const { data, isPending: isProductPending } = useQuery({
    queryKey: ["product", id],
    queryFn: async () =>
      await getProduct({
        token: session?.session.token as string,
        id: id as string,
      }),
    enabled: !!session?.session.token,
  });

  const product = data?.product;

  if (isPending || isProductPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ProductDetail
        _id={product._id}
        title={product.title}
        description={product.description}
        price={product.price}
        images={product.images ?? []}
        seller={{
          name: product.seller?.name,
          profilePicture: product.seller?.profilePicture,
        }}
        reviews={product.reviews}
        isOwner={data.isOwner}
        avgRating={data?.averageRating}
        contact={product.contact}
        location={product.location}
      />
    </div>
  );
};

export default ProductPage;
