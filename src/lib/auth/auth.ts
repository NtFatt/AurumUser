// ==========================================================
// 🔐 useAuth Hook - Quản lý token và thông tin người dùng
// ==========================================================
import { useEffect, useState } from "react";

// Kiểu dữ liệu trả về của useAuth
export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // ✅ Lấy token từ localStorage khi FE load lại
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Hàm đăng nhập
  const login = (newToken: string, userInfo?: AuthUser) => {
    localStorage.setItem("token", newToken);
    if (userInfo) localStorage.setItem("user", JSON.stringify(userInfo));
    setToken(newToken);
    if (userInfo) setUser(userInfo);
  };

  // ✅ Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return { token, user, login, logout, isAuthenticated: !!token };
}
