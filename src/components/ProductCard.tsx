import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ✅ Helper format tiền VNĐ
const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
  category?: string;
  onAddToCart: () => void;
}

export const ProductCard = ({
  name,
  price,
  image,
  rating,
  discount,
  onAddToCart,
}: ProductCardProps) => {
  // ✅ Tính giá sau giảm (nếu có)
  const finalPrice = discount ? (price * (100 - discount)) / 100 : price;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      {/* Tag giảm giá */}
      {discount && (
        <Badge className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground px-3 py-1">
          -{discount}%
        </Badge>
      )}

      {/* Ảnh sản phẩm */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        {/* ⭐ Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? "fill-accent text-accent"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Tên sản phẩm */}
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Giá + nút thêm */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Giá gốc nếu có giảm */}
            {discount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatVND(price)}
              </span>
            )}

            {/* Giá hiển thị (đã format VNĐ) */}
            <span className="text-lg font-bold text-primary">
              {formatVND(finalPrice)}
            </span>
          </div>

          {/* Nút thêm */}
          <Button
            size="icon"
            className="rounded-xl bg-primary hover:bg-primary-dark shadow-medium"
            onClick={onAddToCart}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
