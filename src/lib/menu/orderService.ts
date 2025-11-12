import API from "@/lib/apiClient";

export interface OrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
  size?: string;
  options?: { sugar?: string; ice?: string };
  toppings?: string[];
}

export interface OrderPayload {
  storeId: number;
  paymentMethod: string;
  shippingAddress: string;
  lat: number;
  lng: number;
  items: OrderItemPayload[];
}

export const orderService = {
  // 🟢 Tạo đơn hàng mới
  async create(order: OrderPayload) {
    try {
      console.log("🛰️ [orderService] POST /orders", order);

      const res = await API.post("/orders", order);
      console.log("✅ [orderService] Đơn hàng đã được tạo:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("❌ [orderService] Lỗi khi tạo đơn:", error);

      // Nếu BE trả lỗi có message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo đơn hàng. Vui lòng thử lại.";

      throw new Error(message);
    }
  },

  // 🟢 Lấy danh sách đơn hàng của user (nếu cần dùng)
  async getMyOrders() {
    try {
      const res = await API.get("/orders");
      return res.data;
    } catch (error: any) {
      console.error("❌ [orderService] Lỗi khi lấy danh sách đơn:", error);
      return [];
    }
  },

  // 🟢 Lấy chi tiết 1 đơn hàng cụ thể
  async getOrderById(orderId: number) {
    try {
      const res = await API.get(`/orders/${orderId}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ [orderService] Lỗi khi lấy chi tiết đơn:", error);
      throw new Error(
        error.response?.data?.message || "Không thể tải thông tin đơn hàng."
      );
    }
  },

  // 🟢 Hủy đơn hàng
  async cancelOrder(orderId: number) {
    try {
      const res = await API.patch(`/orders/${orderId}/cancel`);
      return res.data;
    } catch (error: any) {
      console.error("❌ [orderService] Lỗi khi hủy đơn:", error);
      throw new Error(
        error.response?.data?.message || "Không thể hủy đơn hàng."
      );
    }
  },
};
