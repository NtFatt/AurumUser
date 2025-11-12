import API from "@/lib/apiClient";

export interface OrderItem {
  id: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  size?: string;
  toppings?: string[];
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "delivering" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
}

export const orderService = {
  /** 🟢 Lấy danh sách đơn hàng của user */
  async getUserOrders(): Promise<Order[]> {
    try {
      console.log("🛰️ [order.service] GET /orders");
      const res = await API.get("/orders");
      const data = res.data;

      // ✅ Chuẩn hóa dữ liệu trả về
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      console.warn("⚠️ /orders trả về format không hợp lệ:", data);
      return [];
    } catch (error: any) {
      console.error("❌ [order.service] Lỗi khi lấy danh sách đơn:", error);
      return [];
    }
  },

  /** 🟢 Lấy lịch sử thay đổi trạng thái đơn hàng */
  async getOrderHistory(orderId: number) {
    try {
      console.log("🛰️ [order.service] GET /orders/:id/history", orderId);
      const res = await API.get(`/orders/${orderId}/history`);
      const data = res.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      console.warn("⚠️ /orders/:id/history trả về format không hợp lệ:", data);
      return [];
    } catch (error: any) {
      console.error("❌ [order.service] Lỗi khi lấy lịch sử đơn hàng:", error);
      return [];
    }
  },
};
