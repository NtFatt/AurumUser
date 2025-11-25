import { Button } from "@/components/profile-ui/button";
import { Badge } from "@/components/profile-ui/badge";
import { useNavigate } from "react-router-dom";

interface OrderHistoryItemProps {
  item: {
    productId: number;
    productName: string;
    imageUrl?: string;
    size?: string;
    ice?: string;
    sugar?: string;
    toppings?: string[];
    quantity: number;
    reviewed?: boolean; // FE có thể tự đánh dấu
    orderId: number;
  };
  orderStatus: string; // status toàn đơn (pending/processing/completed/cancelled)
}

export default function OrderHistoryItem({
  item,
  orderStatus,
}: OrderHistoryItemProps) {
  const navigate = useNavigate();

  const handleReview = () => {
    const optionsText = [
      item.size ? `Size ${item.size}` : "",
      item.ice ? `Đá: ${item.ice}` : "",
      item.sugar ? `Đường: ${item.sugar}` : "",
      item.toppings?.length ? `Topping: ${item.toppings.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    navigate(
      `/review?productId=${item.productId}` +
        `&name=${encodeURIComponent(item.productName)}` +
        `&image=${encodeURIComponent(item.imageUrl || "")}` +
        `&options=${encodeURIComponent(optionsText)}`
    );
  };

  const isDelivered =
    orderStatus === "completed" || orderStatus === "delivered";

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Hình ảnh */}
      <img
        src={
          item.imageUrl ||
          "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
        }
        alt={item.productName}
        className="w-20 h-20 rounded-xl object-cover"
      />

      {/* Thông tin sản phẩm */}
      <div className="flex-1">
        <h3 className="font-semibold text-base text-foreground">
          {item.productName}
        </h3>

        <p className="text-sm text-muted-foreground">
          {item.size ? `Size ${item.size}` : ""}
          {item.ice ? ` · Đá: ${item.ice}` : ""}
          {item.sugar ? ` · Đường: ${item.sugar}` : ""}
          {item.toppings?.length
            ? ` · Topping: ${item.toppings.join(", ")}`
            : ""}
        </p>

        <p className="text-sm mt-1 text-foreground">
          Số lượng: {item.quantity}
        </p>

        {/* Đã đánh giá */}
        {item.reviewed && (
          <Badge className="bg-green-600 text-white mt-2">Đã đánh giá</Badge>
        )}

        {/* Nút đánh giá */}
        {!item.reviewed && isDelivered && (
          <Button
            size="sm"
            className="mt-2 bg-primary text-white hover:bg-primary/90 rounded-lg"
            onClick={handleReview}
          >
            Đánh giá
          </Button>
        )}
      </div>
    </div>
  );
}
