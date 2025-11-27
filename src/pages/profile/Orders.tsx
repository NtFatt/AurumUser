import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/profile-ui/button";
import { Card } from "@/components/profile-ui/card";
import { Badge } from "@/components/profile-ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/profile-ui/tabs";
import { ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { orderService, Order } from "@/services/order.service";
// 🟢 BỔ SUNG: Import useCart để thao tác với giỏ hàng
import { useCart } from "@/contexts/CartContext";


// 🧩 ĐỊNH NGHĨA INTERFACE CHO ITEM (Đã có sẵn)
interface OrderItem {
  id?: number;
  productId: number; // Quan trọng cho Đánh giá
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  imageUrl?: string; // ⚠️ Chú ý: tên trường này khác với CartItem.image
  toppings?: string[];
}

// 🧩 MỞ RỘNG ORDER INTERFACE ĐỂ CHỨA ITEMS (Đã có sẵn)
interface OrderWithItems extends Omit<Order, 'items'> {
  items: OrderItem[];
}

// ====================================================================
// 🏠 Component Orders
// ====================================================================

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 LẤY HÀM THÊM NHIỀU SẢN PHẨM TỪ CONTEXT
  const { addMultipleItems } = useCart();

  // 🧩 Fetch đơn hàng thật từ backend (logic giữ nguyên)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem đơn hàng!");
          navigate("/auth/login");
          return;
        }

        const data = await orderService.getUserOrders();
        setOrders(data as OrderWithItems[]);
      } catch (err: any) {
        console.warn("⚠️ Không thể tải danh sách đơn hàng:", err?.message || err);
        toast.warning("Không thể tải đơn hàng, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const filterOrders = (status: string) => {
    if (status === "all") return orders;
    return orders.filter((order) => order.status === status);
  };

  // ... (getStatusConfig và formatCurrency giữ nguyên)

  const getStatusConfig = (status: OrderWithItems["status"]) => {
    const configs = {
      pending: {
        label: "Chờ xác nhận",
        icon: <Clock className="w-4 h-4" />,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      processing: {
        label: "Đang xử lý",
        icon: <Package className="w-4 h-4" />,
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      confirmed: {
        label: "Đã xác nhận",
        icon: <Package className="w-4 h-4" />,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      delivering: {
        label: "Đang giao",
        icon: <Truck className="w-4 h-4" />,
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      completed: {
        label: "Hoàn thành",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      cancelled: {
        label: "Đã hủy",
        icon: <XCircle className="w-4 h-4" />,
        color: "bg-red-100 text-red-700 border-red-200",
      },
    };

    return configs[status] || {
      label: "Không rõ",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-gray-100 text-gray-700 border-gray-200",
    };
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  // 📝 Giả lập việc hủy đơn hàng thành công (logic giữ nguyên)
  const handleCancelOrder = (orderId: number) => {
    toast.success("Đơn hàng đã được hủy thành công!");
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  const handleReorder = (orderId: number) => {
    const orderToReorder = orders.find(order => (order.id as number) === orderId);

    if (!orderToReorder || orderToReorder.items.length === 0) {
      toast.error("Không tìm thấy đơn hàng hoặc sản phẩm để đặt lại.");
      return;
    }

    // Ánh xạ các trường cần thiết cho giỏ hàng
    const itemsToReorder = orderToReorder.items.map(item => ({
      productId: item.productId,
      name: item.productName, // ✅ Dùng 'name' để khớp với CartItem
      quantity: item.quantity,
      size: item.size,
      toppings: item.toppings,
      price: item.price,
      image: item.imageUrl || '', // 🔑 FIX: Ánh xạ imageUrl sang image
      // Bỏ qua id ở đây, CartContext sẽ tự tạo id duy nhất
    }));

    // 🔑 GỌI HÀM THÊM NHIỀU SẢN PHẨM VÀO CONTEXT
    addMultipleItems(itemsToReorder);

    toast.success(`Đã thêm ${itemsToReorder.length} sản phẩm của đơn hàng #${orderId} vào giỏ hàng!`);
    setTimeout(() => {
      navigate("/cart");
    }, 150);
  };

  // ... (phần còn lại của return JSX giữ nguyên)

  return (
    <div className="min-h-screen bg-background">
      {/* ... (Header và Tabs) */}
      <header className="bg-primary text-primary-foreground px-4 py-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Đơn hàng của tôi</h1>
        </div>
      </header>

      {/* 🧱 Tabs */}
      <div className="sticky top-[60px] z-40 bg-background border-b overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent border-b-0 min-w-max">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chờ xác nhận" },
              { key: "confirmed", label: "Đã xác nhận" },
              { key: "delivering", label: "Đang giao" },
              { key: "completed", label: "Hoàn thành" },
              { key: "cancelled", label: "Đã hủy" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>


      {/* 📦 Danh sách đơn hàng */}
      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">
            Đang tải danh sách đơn hàng...
          </p>
        ) : filterOrders(activeTab).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Chưa có đơn hàng nào</p>
            <Button onClick={() => navigate("/menu")} variant="default">
              Đặt hàng ngay
            </Button>
          </div>
        ) : (
          filterOrders(activeTab).map((order, idx) => (
            <OrderCard
              key={order.id || idx}
              order={order}
              getStatusConfig={getStatusConfig}
              formatCurrency={formatCurrency}
              onCancel={handleCancelOrder}
              onReorder={handleReorder}
              onViewDetail={() => navigate(`/orders/${order.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ... (OrderCard component giữ nguyên)
// ====================================================================
// 💳 Component OrderCard
// ====================================================================

interface OrderCardProps {
  order: OrderWithItems;
  getStatusConfig: (status: OrderWithItems["status"]) => {
    label: string;
    icon: React.ReactNode;
    color: string;
  };
  formatCurrency: (amount: number) => string;
  onCancel: (orderId: number) => void;
  onReorder: (orderId: number) => void;
  onViewDetail: () => void;
}

const getMainProduct = (items: OrderItem[] | undefined): OrderItem | null => {
  return (items && items.length > 0) ? items[0] : null;
}

const OrderCard = ({
  order,
  getStatusConfig,
  formatCurrency,
  onCancel,
  onReorder,
  onViewDetail,
}: OrderCardProps) => {
  const statusConfig = getStatusConfig(order.status);
  const navigate = useNavigate();

  const mainProduct = getMainProduct(order.items);
  const canReview = order.status === "completed" && mainProduct?.productId;

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="p-4 bg-accent/30 border-b flex items-center justify-between">
        <div> {/* Bắt đầu div bên trái */}
          <p className="text-sm text-muted-foreground">
            Mã đơn:{" "}
            <span className="font-semibold text-foreground">{order.orderNumber || (order as any).Id || order.id || 'Không rõ'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(order.date || (order as any).CreatedAt || (order as any).OrderDate || new Date()).toLocaleDateString('vi-VN')}
          </p>

          {mainProduct && (
            <p className="text-sm font-medium mt-2 text-card-foreground/80">
              {mainProduct.productName} ({mainProduct.quantity}x)
              {order.items.length > 1 && (
                <span className="text-muted-foreground text-xs ml-1">
                  và {order.items.length - 1} sản phẩm khác
                </span>
              )}
            </p>
          )}

        </div>
        <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
          {statusConfig.icon}
          {statusConfig.label}
        </Badge>
      </div>

      {/* Footer */}
      <div className="p-4 bg-accent/20 border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Tổng tiền:</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(order.total || (order as any).TotalAmount || 0)}</span>
        </div>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <>
              <Button
                onClick={() => onCancel(order.id as number)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Hủy đơn
              </Button>
              <Button onClick={onViewDetail} size="sm" className="flex-1">
                Xem chi tiết
              </Button>
            </>
          )}

          {canReview && (
            <>
              <Button
                onClick={() => onReorder(order.id as number)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Đặt lại
              </Button>
              <Button
                onClick={() => navigate(
                  `/profile/review?productId=${mainProduct?.productId || ''}&name=${encodeURIComponent(mainProduct?.productName || '')}&image=${encodeURIComponent(mainProduct?.imageUrl || '')}`
                )}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
              >
                Đánh giá
              </Button>
            </>
          )}


          {(!canReview && order.status !== "pending" && order.status !== "cancelled") && (
            <Button onClick={onViewDetail} size="sm" className="w-full">
              Theo dõi đơn hàng
            </Button>
          )}

          {order.status === "cancelled" && (
            <Button onClick={() => onReorder(order.id as number)} size="sm" className="w-full">
              Đặt lại
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Orders;