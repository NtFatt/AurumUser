import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, Heart, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { ProductService } from "@/lib/menu/productService";
import { ToppingService } from "@/lib/menu/toppingService";

const ProductModal = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  // ==========================
  // 🧩 STATE
  // ==========================
  const [product, setProduct] = useState<any>(null);
  const [toppings, setToppings] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, string>>({
    sweetness: "normal",
    ice: "normal",
  });

  // ==========================
  // 📦 LẤY DỮ LIỆU TỪ BE
  // ==========================
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [productData, toppingData] = await Promise.all([
          ProductService.getById(id),
          ToppingService.getAll(),
        ]);
        setProduct(productData);
        setToppings(toppingData);
      } catch (err) {
        console.error("❌ Lỗi tải chi tiết sản phẩm hoặc topping:", err);
        toast.error("Không thể tải dữ liệu sản phẩm!");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ==========================
  // ⚙️ LOADING / ERROR
  // ==========================
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Đang tải sản phẩm...
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Không tìm thấy sản phẩm
      </div>
    );

  // ==========================
  // 🧮 TÍNH GIÁ
  // ==========================
  const basePrice = product.Price || 0;
  const calculatePrice = () => {
    const sizePrice = selectedSize === "M" ? -14000 : 0;
    const toppingPrice = selectedToppings.reduce((sum, id) => {
      const t = toppings.find((tp) => tp.Id.toString() === id);
      return sum + (t?.Price || 0);
    }, 0);
    return (basePrice + sizePrice + toppingPrice) * quantity;
  };

  // ==========================
  // 🛒 THÊM VÀO GIỎ
  // ==========================
  const handleAddToCart = () => {
    const numericId = Number(product.Id);
    if (isNaN(numericId)) {
      toast.error("Sản phẩm không hợp lệ, không thể thêm vào giỏ hàng!");
      return;
    }

    const toppingNames = toppings
      .filter((t) => selectedToppings.includes(t.Id.toString()))
      .map((t) => t.Name);

    addItem({
      productId: numericId,
      productName: product.Name,   // ✔ thêm dòng này
      name: product.Name,          // ✔ giữ name để FE dùng
      image: product.ImageUrl || "https://placehold.co/500x500",
      size: selectedSize,
      toppings: toppingNames,
      price: calculatePrice() / quantity,
      quantity,
      options: {
        sugar: customizations.sweetness,
        ice: customizations.ice,
      },
    });


    toast.success("🛍️ Đã thêm vào giỏ hàng!", {
      description: `${product.Name} - ${quantity} ly (${selectedSize})`,
    });
  };

  // ==========================
  // 🧊 CHỌN TOPPING
  // ==========================
  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ==========================
  // 🖼️ HIỂN THỊ
  // ==========================
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🧭 Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <span>Trang chủ</span>
        <span className="mx-2">/</span>
        <span>Menu</span>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">{product.Name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Ảnh sản phẩm */}
        <div className="space-y-4">
          <Card className="overflow-hidden bg-muted/30">
            <img
              src={product.ImageUrl || "https://placehold.co/500x500"}
              alt={product.Name}
              className="w-full h-[420px] object-cover"
            />
          </Card>

          {/* Rating + Tag */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{product.Rating || 4.8}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.Reviews || 0} đánh giá
              </p>
            </Card>
            <Card className="p-4 text-center">
              <div className="font-bold text-lg mb-1 text-primary">Best Seller</div>
              <p className="text-sm text-muted-foreground">Top 5 bán chạy</p>
            </Card>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              {product.Name} ({selectedSize})
            </h1>
            <Button variant="ghost" size="icon">
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Mã sản phẩm: {product.Id}</p>

          {/* Giá */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">
              {calculatePrice().toLocaleString()}đ
            </span>
            {selectedSize === "M" && <Badge variant="secondary">-14.000đ</Badge>}
          </div>

          {/* Mô tả */}
          <p className="text-muted-foreground leading-relaxed">
            {product.Description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          {/* Kích cỡ */}
          <div>
            <label className="block text-sm font-medium mb-3">Chọn kích cỡ</label>
            <div className="flex gap-3">
              {["M", "L"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className="flex-1 h-12 text-lg font-medium"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Topping */}
          <div>
            <label className="block text-sm font-medium mb-3">Topping (tùy chọn)</label>
            <div className="grid grid-cols-2 gap-3">
              {toppings.length > 0 ? (
                toppings.map((topping) => (
                  <Button
                    key={topping.Id}
                    variant={
                      selectedToppings.includes(topping.Id.toString())
                        ? "default"
                        : "outline"
                    }
                    className="justify-between"
                    onClick={() => toggleTopping(topping.Id.toString())}
                  >
                    <span>{topping.Name}</span>
                    <span className="text-primary">
                      +{topping.Price.toLocaleString()}đ
                    </span>
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Không có topping khả dụng</p>
              )}
            </div>
          </div>

          {/* Số lượng + Thêm giỏ */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-6 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thêm vào giỏ hàng ({calculatePrice().toLocaleString()}đ)
            </Button>
          </div>

          <Card className="p-4 bg-muted/30">
            <h3 className="font-medium mb-2">Thông tin thêm</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Giao hàng trong vòng 30-45 phút</li>
              <li>• Miễn phí giao hàng cho đơn từ 100.000đ</li>
              <li>• Đổi trả trong 24h nếu có vấn đề</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
