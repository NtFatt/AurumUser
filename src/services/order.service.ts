// src/services/order.service.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  async getUserOrders(token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ API lỗi:", result);
        throw new Error(result.message || "Không thể tải danh sách đơn hàng");
      }

      // ✅ BE trả { success, data }
      return result.data || [];
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
      return [];
    }
  },

  /** 🟢 Lấy lịch sử thay đổi trạng thái đơn hàng */
  async getOrderHistory(orderId: number, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ API lỗi:", result);
        throw new Error(result.message || "Không thể tải lịch sử đơn hàng");
      }

      // ✅ Trả về mảng lịch sử (OrderHistory[])
      return result.data || [];
    } catch (error) {
      console.error("❌ Lỗi khi lấy lịch sử đơn hàng:", error);
      return [];
    }
  },
};
