import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "@/lib/api"; // ✅ đúng đường dẫn thật

// ============================================================
// 🎨 Tailwind Class Helper
// ============================================================
/**
 * Gộp class Tailwind an toàn & thông minh.
 * Sử dụng: cn("p-2", condition && "bg-red-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// 💰 Định dạng tiền tệ
// ============================================================
/**
 * Định dạng số tiền theo kiểu Việt Nam (VD: 50.000 ₫)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "0 ₫";
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

// ============================================================
// 📅 Định dạng ngày / giờ
// ============================================================
/**
 * Định dạng ngày/tháng/năm
 * @example formatDate("2025-10-09T00:00:00Z") -> "09/10/2025"
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Định dạng ngày + giờ (VD: 09/10/2025 14:30)
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return `${d.toLocaleDateString("vi-VN")} ${d
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)}`;
}

// ============================================================
// ⏳ Tiện ích chờ / delay
// ============================================================
/**
 * Tạm dừng xử lý async (đơn vị ms)
 * @example await sleep(1000)
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// 🧩 Xử lý chuỗi & định danh
// ============================================================
/**
 * Sinh ID ngẫu nhiên
 * @example randomId("ORD_") -> ORD_8394JKS2
 */
export function randomId(prefix = ""): string {
  const id = Math.random().toString(36).substring(2, 10).toUpperCase();
  return prefix ? `${prefix}${id}` : id;
}

/**
 * Chuẩn hóa text (loại bỏ khoảng trắng dư thừa)
 */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// ============================================================
// 📧 Validation Helper
// ============================================================
/**
 * Kiểm tra định dạng email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam
 */
export function isValidPhone(phone: string): boolean {
  return /^(0|\+84)[0-9]{9}$/.test(phone);
}

// ============================================================
// 🧠 Deep Clone Object
// ============================================================
/**
 * Tạo bản sao sâu của object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================
// 🧪 Kiểm tra kết nối API (debug)
// ============================================================
/**
 * Kiểm tra nhanh xem API backend có hoạt động không.
 */
export async function testApiConnection() {
  try {
    const res = await api.get("/products");
    console.log("✅ API Connected:", res.data);
  } catch (err: any) {
    console.error("❌ API Connection Failed:", err.message);
  }
}
