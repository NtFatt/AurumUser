import React, { createContext, useContext, useState, ReactNode } from "react";

// 🧾 Kiểu dữ liệu item trong giỏ hàng
export interface CartItem {
  id: string;
  productId: number; // ✅ đổi sang number để khớp API
  name: string;
  price: number;
  image: string;
  size: string;
  toppings: string[];
  quantity: number;
  note?: string;

  // ✅ Thêm lựa chọn thêm đường / đá
  options?: {
    sugar?: string;
    ice?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // 🛒 Thêm sản phẩm mới vào giỏ
  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.size}-${item.toppings.join(",")}-${Date.now()}`;
    setItems((prev) => [...prev, { ...item, id }]);
  };

  // ❌ Xóa sản phẩm
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 Cập nhật số lượng
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // ✏️ Ghi chú cho từng sản phẩm
  const updateNote = (id: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  // 🧹 Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setItems([]);
  };

  // 🧮 Tổng số lượng & tổng tiền
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNote,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
