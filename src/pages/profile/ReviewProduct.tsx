import { useState } from "react";
import { Star, Camera, Video, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/profile-ui/button";
import { Card } from "@/components/profile-ui/card";
import { Textarea } from "@/components/profile-ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ReviewProduct = () => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const tagOptions = [
    "Chuyên nghiệp, chu đáo",
    "Thân thiện, linh hoạt",
    "Đáng tin cậy",
    "Giao hàng đúng hẹn",
    "Đồng phục gọn gàng",
    "Bảo quản hàng hóa tốt",
    "Cập nhật trạng thái thường xuyên",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token"); // 🟢 Tùy bạn đang lưu key nào khi login

    if (!token) {
      toast.error("Chưa đăng nhập, vui lòng đăng nhập lại");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("productId")) || 1;

    console.log("📦 Token FE gửi:", token);

    const res = await axios.post(
      "http://localhost:3000/api/reviews",
      {
        productId,
        rating,
        comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    const data = res.data;
    if (data.ok) {
      toast.success("Đã gửi đánh giá thành công!");
      navigate("/profile/orders");
    } else {
      toast.error(data.error || "Không thể gửi đánh giá");
    }
  } catch (error: any) {
    console.error("❌ Axios error:", error);
    toast.error("Lỗi kết nối máy chủ");
  }
};

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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
            //src="https://images.unsplash.com/photo-1527169402691-a3d13e8d127b?w=400&h=400&fit=crop"
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
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <Camera className="w-5 h-5 mr-2" />
            Thêm Hình ảnh
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <Video className="w-5 h-5 mr-2" />
            Thêm Video
          </Button>
        </div>

        {/* Comment box */}
        <Textarea
          placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none rounded-xl"
          rows={4}
        />

        {/* Ratings for service, delivery, driver */}
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
