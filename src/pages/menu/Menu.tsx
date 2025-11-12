import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/profile-ui/input";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { CartSummary } from "@/components/CartSummary";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/profile-ui/badge";
import { useNavigate } from "react-router-dom";
import React from "react";
import { ProductService } from "@/lib/menu/productService"; // ✅ thêm import

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);

  // ✅ Lấy dữ liệu thật từ backend thay mock
  useEffect(() => {
    (async () => {
      try {
        const data = await ProductService.getAll();
        setProducts(data || []);
      } catch (err) {
        console.error("❌ Lỗi tải sản phẩm:", err);
      }
    })();
  }, []);

  // ✅ Giữ nguyên logic lọc
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.CategoryName?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.Name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ✅ Giữ nguyên logic điều hướng
  const handleProductClick = (product: any) => {
    navigate(`/menu/product/${product.ProductID}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="bg-gradient-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-2">Ưu đãi đặc biệt</h2>
            <p className="text-lg opacity-90">Giảm giá lên đến 20% cho sản phẩm mới</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đồ uống, bánh ngọt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 focus:border-primary"
              />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Danh mục</h3>
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Sản phẩm phổ biến</h3>
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} sản phẩm
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.ProductID}
                    id={product.ProductID}
                    name={product.Name}
                    price={product.Price}
                    image={product.Image || "https://placehold.co/500x500?text=No+Image"}
                    rating={product.Rating || 5}
                    category={product.CategoryName}
                    onAddToCart={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="hidden lg:block w-[350px]">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
