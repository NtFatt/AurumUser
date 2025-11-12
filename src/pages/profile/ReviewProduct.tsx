import { useState } from "react";
import {
  Star,
  Camera,
  Video,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/profile-ui/button";
import { Card } from "@/components/profile-ui/card";
import { Textarea } from "@/components/profile-ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient"; // ✅ Dùng axios instance chuẩn

const ReviewProduct = () => {
  const navigate = useNavigate();

  // ⭐ State đánh giá
  const [rating, setRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const tagOptions = [
    "Chuyên nghiệp, chu đáo",
    "Thân thiện, linh hoạt",
    "Đáng tin cậy",
    "Giao hàng đúng hẹn",
    "Đồng phục gọn gàng",
    "Bảo quản hàng hóa tốt",
    "Cập nhật trạng thái thường xuyên",
  ];

  console.group("🧾 DEBUG ReviewProduct");

  // 🧩 Lấy token từ localStorage
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  console.log("🔑 Token:", token);


  // ✅ Gửi review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Chưa đăng nhập, vui lòng đăng nhập lại");
      console.warn("⚠️ Không tìm thấy token trong localStorage");
      console.groupEnd();
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("productId")) || 1;
    console.log("📦 productId:", productId);


    try {
      const payload = {
        productId,
        rating,
        serviceRating,
        deliveryRating,
        driverRating,
        comment,
        tags,
      };

      console.log("🛰️ [ReviewProduct] POST:", payload);

      const res = await apiClient.post("/reviews", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📩 Response status:", res.status);
      console.log("📩 Response data:", res.data);

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Gửi đánh giá thành công!");
        console.groupEnd();
        navigate("/profile/orders");
      } else {
        console.error("❌ BE trả lỗi:", res.data);
        toast.error(res.data?.message || "Không thể gửi đánh giá");
        console.groupEnd();
      }
    } catch (error: any) {
      // 🟢 6️⃣ Log lỗi mạng hoặc backend
      console.error("🚨 Axios Error:", error);
      console.error("📄 Response data:", error.response?.data);
      console.error("🔢 Status code:", error.response?.status);
      toast.error("Lỗi kết nối máy chủ hoặc token hết hạn");
      console.groupEnd();
    }
  };

  // ✅ Upload hình ảnh preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ⭐ Component hiển thị sao
  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => onChange(star)}
          className={`w-7 h-7 cursor-pointer transition-transform hover:scale-110 ${star <= value
            ? "fill-[#236513] text-[#236513]"
            : "text-muted-foreground"
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-primary text-primary-foreground flex items-center px-4 py-3 shadow-lg z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-3 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Đánh giá sản phẩm</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-2xl px-4 py-6 space-y-6"
      >
        {/* Product info */}
        <Card className="p-4 flex items-center gap-4 shadow-soft border-border">
          <img
            src="https://images.unsplash.com/photo-1527169402691-a3d13e8d127b?w=400&h=400&fit=crop"
            alt="Trà Sữa Phúc Long"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-card-foreground">
              Trà Sữa Phúc Long
            </h2>
            <p className="text-sm text-muted-foreground">
              Size M · Đá: Vừa · Đường: 70%
            </p>
          </div>
        </Card>

        {/* Product rating */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold mb-3 text-card-foreground">
            Chất lượng sản phẩm
          </h3>
          <StarRating value={rating} onChange={setRating} />
          <p className="text-sm text-muted-foreground mt-2">
            {rating === 5
              ? "Tuyệt vời"
              : rating === 4
                ? "Tốt"
                : rating === 3
                  ? "Bình thường"
                  : "Cần cải thiện"}
          </p>
        </Card>

        {/* Upload buttons */}
        <div className="flex gap-4">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 rounded-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Thêm Hình ảnh
            </Button>
          </label>

          <Button
            type="button"
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <Video className="w-5 h-5 mr-2" />
            Thêm Video
          </Button>
        </div>

        {/* Preview ảnh đã chọn */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {imageFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx}`}
                className="w-full h-24 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* Comment */}
        <Textarea
          placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none rounded-xl"
          rows={4}
        />

        {/* Extra ratings */}
        <Card className="p-6 shadow-soft space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Dịch vụ của cửa hàng</h4>
            <StarRating value={serviceRating} onChange={setServiceRating} />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Tốc độ giao hàng</h4>
            <StarRating value={deliveryRating} onChange={setDeliveryRating} />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Tài xế</h4>
            <StarRating value={driverRating} onChange={setDriverRating} />
          </div>
        </Card>

        {/* Tag suggestions */}
        <Card className="p-6 shadow-soft">
          <h4 className="font-semibold mb-3">Mô tả thêm</h4>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${tags.includes(tag)
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-[#236513] text-white text-lg font-semibold h-12 rounded-xl shadow-medium hover:opacity-90"
        >
          Gửi đánh giá
        </Button>
      </form>
    </div>
  );
};

export default ReviewProduct;
