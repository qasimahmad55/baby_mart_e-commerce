"use client";

import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useWishlistStore } from "@/lib/store";
import { Product } from "@/types/types";
import { toast } from "sonner";

interface Props {
  product?: Product;
  className?: string;
}

const WishlistButton = ({ product, className }: Props) => {
  const [loading, setLoading] = useState(false);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();

  if (!product) {
    return null;
  }

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleWishlistToggle = async () => {
    try {
      setLoading(true);
      if (isInWishlist) {
        removeFromWishlist(product._id);
        toast.success(`${product.name} removed from wishlist`);
      } else {
        addToWishlist(product);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className={cn(
        "p-2 rounded-full transition-colors hover:bg-gray-100 disabled:opacity-50",
        className
      )}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Heart
          size={20}
          fill={isInWishlist ? "currentColor" : "none"}
          className={isInWishlist ? "text-red-500" : ""}
        />
      )}
    </button>
  );
};

export default WishlistButton;
