// src/services/voucherService.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Voucher {
  id: number;
  code: string;
  discountPercent: number;
  requiredPoints: number;
  expiryDate: string;
  isUsed?: boolean;
}

// ============================================================
// 🧩 Voucher Service – API + Mock Fallback
// ============================================================
export const voucherService = {
  // 🟢 Get all available vouchers
  async getAvailableVouchers(token?: string): Promise<Voucher[]> {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/vouchers/available`, { headers });

      if (!response.ok) {
        console.warn(`⚠️ API /vouchers/available trả về lỗi ${response.status}`);
        return getMockVouchers(); // fallback ngay
      }

      const data = await response.json();

      // 🔍 Đảm bảo chỉ trả về array hợp lệ
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      console.warn("⚠️ API /vouchers/available trả về không đúng format:", data);
      return getMockVouchers();
    } catch (error) {
      console.error("❌ Error fetching vouchers:", error);
      return getMockVouchers();
    }
  },

  // 🟢 Get user's vouchers
  async getUserVouchers(token: string): Promise<Voucher[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vouchers/my-vouchers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user vouchers");

      const data = await response.json();
      return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("❌ Error fetching user vouchers:", error);
      return [];
    }
  },

  // 🟢 Redeem voucher
  async redeemVoucher(
    voucherId: number,
    token: string
  ): Promise<{ success: boolean; message: string; voucher?: Voucher }> {
    try {
      const response = await fetch(`${API_BASE_URL}/vouchers/redeem/${voucherId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to redeem voucher");

      return { success: true, message: data.message, voucher: data.voucher };
    } catch (error: any) {
      console.error("❌ Error redeeming voucher:", error);
      return { success: false, message: error.message };
    }
  },

  // 🟢 Validate voucher code
  async validateVoucher(
    code: string,
    orderAmount: number,
    token?: string
  ): Promise<{ valid: boolean; discount?: number; message?: string }> {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/vouchers/validate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code, orderAmount }),
      });

      const data = await response.json();
      if (!response.ok) return { valid: false, message: data.message };

      return { valid: true, discount: data.discount, message: data.message };
    } catch (error: any) {
      console.error("❌ Error validating voucher:", error);
      return { valid: false, message: error.message };
    }
  },
};

// ============================================================
// 🧪 Mock data for dev (always safe fallback)
// ============================================================
function getMockVouchers(): Voucher[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    { id: 1, code: "WELCOME10", discountPercent: 10, requiredPoints: 0, expiryDate: futureDate.toISOString(), isUsed: false },
    { id: 2, code: "SAVE15", discountPercent: 15, requiredPoints: 100, expiryDate: futureDate.toISOString(), isUsed: false },
    { id: 3, code: "VIP20", discountPercent: 20, requiredPoints: 200, expiryDate: futureDate.toISOString(), isUsed: false },
  ];
}
