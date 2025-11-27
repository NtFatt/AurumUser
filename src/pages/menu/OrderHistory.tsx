import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, CheckCircle2, Clock, Truck, XCircle, Package } from "lucide-react";
import { Button } from "@/components/profile-ui/button";
import { Card } from "@/components/profile-ui/card"; // Sử dụng Card component
import { Badge } from "@/components/profile-ui/badge"; // Sử dụng Badge component
import { useNavigate } from "react-router-dom";
import API from "@/lib/apiClient";

// ======================================================
// 🧩 CÁC HÀM HỖ TRỢ
// ======================================================

const formatVND = (value: any) => {
  if (!value || isNaN(value)) return "0 ₫";
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// 🟢 SAFE PARSE JSON (Lấy items từ ProductSummary)
const parseSummary = (text: any) => {
  try {
    if (!text) return { items: [], feesAndDiscounts: {} };
    const fullSummary = JSON.parse(text);

    // Trả về cả items và chi tiết phí (nếu có)
    return {
      items: Array.isArray(fullSummary?.items) ? fullSummary.items : [],
      feesAndDiscounts: fullSummary?.feesAndDiscounts || {}
    };
  } catch {
    return { items: [], feesAndDiscounts: {} };
  }
};

// ======================================================
// 💳 COMPONENT ORDER CARD
// ======================================================

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  productId?: number;
  size?: string;
  toppings?: string[];
}

interface OrderData {
  Id: number;
  Total: number;
  CreatedAt: string;
  Status: string;
  PaymentMethod: string;
  ProductSummary: string;
}

interface OrderCardProps {
  order: OrderData;
  onViewDetail: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return { label: "Hoàn thành", icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-green-100 text-green-700 border-green-200" };
    case "pending":
      return { label: "Chờ xác nhận", icon: <Clock className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    case "confirmed":
    case "processing":
      return { label: "Đang xử lý", icon: <Package className="w-4 h-4" />, color: "bg-blue-100 text-blue-700 border-blue-200" };
    case "delivering":
      return { label: "Đang giao", icon: <Truck className="w-4 h-4" />, color: "bg-purple-100 text-purple-700 border-purple-200" };
    case "cancelled":
      return { label: "Đã hủy", icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-700 border-red-200" };
    default:
      return { label: "Không rõ", icon: <Clock className="w-4 h-4" />, color: "bg-gray-100 text-gray-700 border-gray-200" };
  }
};

const OrderCard = ({ order, onViewDetail }: OrderCardProps) => {
  // Phân tích ProductSummary để lấy danh sách items và chi phí
  const { items, feesAndDiscounts } = useMemo(() => parseSummary(order.ProductSummary), [order.ProductSummary]);
  const statusConfig = getStatusConfig(order.Status);
  const mainProduct = items[0] as OrderItem | undefined;
  const canReview = (order.Status.toLowerCase() === "completed" || order.Status.toLowerCase() === "done") && mainProduct?.productId;
  const totalItems = items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
  return (
    <Card
      className="overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onViewDetail} // Click vào Card để xem chi tiết
    >
      {/* Header và Status */}
      <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
        <div className="text-sm font-semibold text-card-foreground">
          Mã đơn: <span className="text-primary/80">{order.Id}</span>
        </div>
        <Badge className={`${statusConfig.color} border flex items-center gap-1 font-semibold`}>
          {statusConfig.icon}
          {statusConfig.label}
        </Badge>
      </div>

      {/* Chi tiết Tóm tắt Sản phẩm */}
      <div className="p-4 flex gap-4">
        {/* Ảnh sản phẩm chính (Có thể thêm nếu có imageUrl trong item) */}
        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center border">
          <Package className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <p className="font-semibold text-card-foreground">
            {mainProduct?.productName || 'Sản phẩm không rõ'}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mainProduct?.size && `Size: ${mainProduct.size} • `}
            {totalItems} sản phẩm
            {items.length > 1 && <span className="ml-1 opacity-70"> (+{items.length - 1} loại khác)</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Thanh toán: {order.PaymentMethod || "Không rõ"} | Ngày đặt: {new Date(order.CreatedAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Footer: Tổng tiền và Hành động */}
      <div className="p-4 bg-accent/20 border-t flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Tổng cộng</span>
          <span className="text-xl font-bold text-primary">{formatVND(order.Total)}</span>
        </div>

        {/* Nút Hành động */}
        <div className="flex gap-2">
          {canReview && mainProduct && (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Ngăn sự kiện click lan ra Card
                // Logic điều hướng Đánh giá
              }}
              size="sm"
              className="bg-primary hover:opacity-90 rounded-xl"
            >
              Đánh giá
            </Button>
          )}

          {order.Status.toLowerCase() !== 'completed' && order.Status.toLowerCase() !== 'cancelled' && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(); // Xem chi tiết
              }}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              Chi tiết
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ======================================================
// 🏠 COMPONENT CHÍNH: ORDER HISTORY
// ======================================================

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Gọi endpoint an toàn đã được xác nhận
        const res = await API.get("/history/my");

        const rawOrders = res.data?.data || [];

        // Lọc các đối tượng rỗng/thiếu ID (như đã fix trong bước trước)
        const filteredOrders: OrderData[] = rawOrders.filter((o: any) =>
          o && typeof o === 'object' && o.Id && o.TotalAmount
        ).map((o: any) => ({
          Id: o.Id,
          Total: o.TotalAmount,
          CreatedAt: o.OrderDate,
          Status: o.Status,
          PaymentMethod: o.PaymentMethod,
          ProductSummary: o.ProductSummary,
        }));

        setOrders(filteredOrders);
      } catch (err) {
        console.error("❌ Lỗi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Đang tải đơn hàng...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Lịch sử đơn hàng</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Bạn chưa có đơn hàng nào
            </h2>
            <Button
              onClick={() => navigate("/menu")}
              className="bg-gradient-primary text-primary-foreground rounded-xl"
            >
              Đặt hàng ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.Id}
                order={order}
                onViewDetail={() => navigate(`/orders/${order.Id}`)} // Giả định route chi tiết
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}