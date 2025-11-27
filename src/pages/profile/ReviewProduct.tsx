import { useState } from "react";
import { Star, Camera, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/profile-ui/button";
import { Card } from "@/components/profile-ui/card";
import { Textarea } from "@/components/profile-ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api"; // 💡 axios chuẩn của hệ thống

const ReviewProduct = () => {
  const navigate = useNavigate();

  // ⭐ Rating state
  const [rating, setRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const params = new URLSearchParams(window.location.search);

  const productId = Number(params.get("productId"));
  const productName = params.get("name") || "Sản phẩm đã mua";
  const productImage =
    params.get("image") ||
    "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"; // fallback
  const productOptions = params.get("options") || "";

  // FE-only preview images, BE chưa hỗ trợ upload
  const tagOptions = [
    "Chuyên nghiệp, chu đáo",
    "Thân thiện, linh hoạt",
    "Đáng tin cậy",
    "Giao hàng đúng hẹn",
    "Đồng phục gọn gàng",
    "Bảo quản hàng hóa tốt",
    "Cập nhật trạng thái thường xuyên",
  ];

  // 🔑 Token chuẩn
  const token = localStorage.getItem("accessToken");
  // 🟢 Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Bạn cần đăng nhập để gửi đánh giá");
      return;
    }

    // Lấy productId từ query string
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("productId"));

    if (!productId) {
      toast.error("Không xác định được sản phẩm để đánh giá");
      return;
    }

    const payload = {
      productId,
      rating,
      comment: comment.trim(),
      serviceRating,
      deliveryRating,
      driverRating,
      tags,
      images: [], // BE chưa hỗ trợ upload file
    };

    try {
      const res = await api.post(
        "/reviews",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.ok) {
        toast.success("Gửi đánh giá thành công!");
        navigate("/profile/orders");
      } else {
        toast.error(res.data?.message || "Không thể gửi đánh giá");
      }
    } catch (err: any) {
      console.error("Review error:", err);
      toast.error(err.response?.data?.message || "Lỗi kết nối máy chủ");
    }
  };

  // 🟣 Preview images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ⭐ Component hiển thị rating
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-2xl px-4 py-6 space-y-6"
      >
        {/* Product info (tạm static, sau này lấy từ order item) */}
        <Card className="p-4 flex items-center gap-4 shadow-soft border-border">
          <img
            src={productImage}
            alt={productName}
            className="w-20 h-20 rounded-xl object-cover"
          />

          <div className="flex-1">
            <h2 className="font-semibold text-lg text-card-foreground">
              {productName}
            </h2>
            {productOptions && (
              <p className="text-sm text-muted-foreground">
                {productOptions}
              </p>
            )}
          </div>
        </Card>


        {/* Product rating */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold mb-3 text-card-foreground">
            Chất lượng sản phẩm
          </h3>
          <StarRating value={rating} onChange={setRating} />
        </Card>

        {/* Upload image */}
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
              Thêm hình ảnh
            </Button>
          </label>

          <Button
            type="button"
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <Video className="w-5 h-5 mr-2" />
            Thêm video
          </Button>
        </div>

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
          placeholder="Hãy chia sẻ cảm nhận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none rounded-xl"
          rows={4}
        />

        {/* Extra ratings */}
        <Card className="p-6 shadow-soft space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Dịch vụ cửa hàng</h4>
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

        {/* Tags */}
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
