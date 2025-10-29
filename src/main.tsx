import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { testApiConnection } from "@/lib/utils";

// =============================================================
// 🚀 ENTRY POINT - PHÚC LONG FE
// -------------------------------------------------------------
// ✅ Kiểm tra API khi dev (FE ↔ BE)
// ✅ Có fallback UI nếu root null
// ✅ Giảm log dư thừa khi build production
// =============================================================

// 🧪 Chỉ test API khi ở chế độ development
if (import.meta.env.DEV) {
  testApiConnection();
}

// 🧱 Đảm bảo root tồn tại
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Không tìm thấy phần tử #root trong index.html!");
  throw new Error("Root element missing!");
}

// ✅ Render ứng dụng React
const root = ReactDOM.createRoot(rootElement);

// ⚙️ Bạn có thể bật/tắt StrictMode tùy theo nhu cầu dev
root.render(
  <React.StrictMode>
    <App />
    {/* 🔔 Toaster toàn cục: chỉ nên có 1 instance */}
    <Toaster />
  </React.StrictMode>
);
