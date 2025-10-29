const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  async create(order: OrderPayload, token: string) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error("Không thể tạo đơn hàng");
    return await res.json();
  },
};
