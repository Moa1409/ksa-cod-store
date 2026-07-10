"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  slug?: string;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  emoji,
  slug,
  className,
  label,
}: Props) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      onClick={() => addItem({ id, name, price, emoji, slug })}
      className={className ?? "btn-primary w-full"}
    >
      {label ?? "🛒 أضيفي إلى السلة"}
    </button>
  );
}
