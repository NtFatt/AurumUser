import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api";

/**
 * =============================================================
 * 🧩 ProtectedRoute Component
 * -------------------------------------------------------------
 * ✅ Kiểm tra accessToken trong localStorage
 * ✅ Nếu token hết hạn → tự gọi /auth/refresh
 * ✅ Nếu refresh thành công → cập nhật token mới, cho phép truy cập
 * ✅ Nếu refresh thất bại → xóa localStorage và chuyển về /auth/login
 * =============================================================
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = đang kiểm tra

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // ❌ Không có token → redirect về login
      if (!accessToken && !refreshToken) {
        setAuthorized(false);
        return;
      }

      try {
        // 🟢 Gửi request nhỏ để kiểm tra accessToken còn hạn
        await api.get("/auth/profile");
        setAuthorized(true);
      } catch (err: any) {
        const status = err.response?.status;

        // ⚠️ Token hết hạn → thử refresh
        if (status === 401 && refreshToken) {
          try {
            const res = await api.post("/auth/refresh", { refreshToken });
            const newAccessToken = res.data?.accessToken;

            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              console.log("🔄 Token refreshed thành công");
              setAuthorized(true);
              return;
            }
          } catch (refreshErr) {
            console.warn("🚫 Refresh token failed:", refreshErr);
          }
        }

        // ❌ Nếu refresh cũng fail → xoá dữ liệu & redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Loading state khi đang kiểm tra token
  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Đang xác thực phiên đăng nhập...
      </div>
    );
  }

  // 🚪 Nếu chưa đăng nhập → redirect về trang login
  if (!authorized) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ Nếu token hợp lệ → render nội dung bên trong
  return <>{children}</>;
}
