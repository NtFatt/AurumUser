import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/profile-ui/button";
import { Input } from "@/components/profile-ui/input";
import { Label } from "@/components/profile-ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/profile-ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coffee, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api"; // ✅ Dùng axios instance mặc định

// ===============================
// ⚙️ Validation schema
// ===============================
const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email không hợp lệ" }).max(255),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }).max(100),
});

// ===============================
// 🧩 Component
// ===============================
const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ===============================
  // 🧠 Handle input
  // ===============================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ===============================
  // 🚀 Handle submit
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Đã bấm Đăng nhập");

    setErrors({});

    // ✅ Validate form bằng Zod
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === "string") {
          fieldErrors[field as keyof typeof fieldErrors] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // ✅ Gửi API
    setIsLoading(true);
    try {
      console.log("➡️ Gửi request tới:", api.defaults.baseURL + "/auth/login");

      const response = await api.post("/auth/login", {
        Email: formData.email,
        Password: formData.password,
      });

      const data = response.data;
      console.log("✅ Phản hồi đăng nhập:", data);


      // ✅ Lưu token & user
      //Siêu quan trọng, cấm mày đụng dô 3 dòng if này
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }


      // ✅ Thông báo
      toast({
        title: "Đăng nhập thành công 🎉",
        description: `Chào mừng ${data.user?.name || "bạn"} quay lại!`,
      });

      // ✅ Chuyển hướng tới Menu
      navigate("/menu", { replace: true });
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Email hoặc mật khẩu không đúng.";

      toast({
        title: "Đăng nhập thất bại",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // 🧱 JSX UI
  // ===============================
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow mb-4">
            <Coffee className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Phúc Long Coffee & Tea</h1>
          <p className="text-muted-foreground mt-2">Đăng nhập để tiếp tục</p>
        </div>

        {/* Card */}
        <Card className="shadow-[var(--shadow-premium)] border-border/50">
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>Nhập thông tin tài khoản của bạn</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary-glow transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                to="/auth/register"
                className="text-primary hover:text-primary-glow font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <a href="#" className="text-primary hover:text-primary-glow transition-colors">
            Điều khoản sử dụng
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
