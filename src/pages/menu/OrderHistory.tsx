import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/profile-ui/button";
import { useNavigate } from "react-router-dom";
import API from "@/lib/apiClient";

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Gọi BE thật
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/order-history/my");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Hoàn thành
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 text-accent font-medium">
            <Clock className="w-4 h-4" /> Đang xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-destructive font-medium">
            <XCircle className="w-4 h-4" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
            <Clock className="w-4 h-4" /> Chờ xử lý
          </span>
        );
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">
            Lịch sử đơn hàng
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img
              src="https://illustrations.popsy.co/amber/empty-cart.svg"
              alt="Empty orders"
              className="w-40 h-40 mb-6"
            />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Bạn chưa có đơn hàng nào
            </h2>
            <p className="text-muted-foreground mb-6">
              Hãy đặt đơn hàng đầu tiên để trải nghiệm hương vị Phúc Long ☕
            </p>
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
              <div
                key={order.Id}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-lg text-card-foreground">
                      Mã đơn: {order.Id || order.OrderCode}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Ngày đặt:{" "}
                      {new Date(order.CreatedAt || order.Date).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  {getStatusLabel(order.Status)}
                </div>

                {/* Danh sách sản phẩm nếu có */}
                {order.Items?.length > 0 && (
                  <div className="border-t pt-3 mt-3 space-y-2">
                    {order.Items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.ProductName} × {item.Quantity}
                        </span>
                        <span className="font-semibold">
                          {formatVND(item.Price * item.Quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <span className="text-sm text-muted-foreground">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatVND(order.Total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
