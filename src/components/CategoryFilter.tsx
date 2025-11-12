import { useEffect, useState } from "react";
import { Coffee, IceCream, Cake, Salad, Wine, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryService } from "@/lib/menu/categoryService";

const staticIcons = {
  coffee: Coffee,
  tea: Wine,
  smoothie: IceCream,
  cake: Cake,
  snack: Salad,
  all: UtensilsCrossed,
};

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: any }[]
  >([
    { id: "all", name: "Tất cả", icon: UtensilsCrossed },
  ]);

  // ✅ Kết hợp dữ liệu từ BE (nếu có)
  useEffect(() => {
    (async () => {
      try {
        const data = await CategoryService.getAll(); // GET /api/categories
        const dynamic = data.map((cat: any) => {
          const key = (cat.Slug?.toLowerCase() || cat.Name?.toLowerCase()) as keyof typeof staticIcons;
          return {
            id: cat.Slug || cat.Name?.toLowerCase() || cat.CategoryID?.toString(),
            name: cat.Name,
            icon: staticIcons[key] || UtensilsCrossed,
          };
        });


        // ✅ Giữ “Tất cả” + dữ liệu động
        setCategories((prev) => [...prev, ...dynamic]);
      } catch (err) {
        console.error("❌ Lỗi tải danh mục:", err);
        // fallback tĩnh nếu API lỗi
        setCategories([
          { id: "all", name: "Tất cả", icon: UtensilsCrossed },
          { id: "coffee", name: "Cà phê", icon: Coffee },
          { id: "tea", name: "Trà", icon: Wine },
          { id: "smoothie", name: "Sinh tố", icon: IceCream },
          { id: "cake", name: "Bánh", icon: Cake },
          { id: "snack", name: "Đồ ăn nhẹ", icon: Salad },
        ]);
      }
    })();
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selected === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 min-w-[100px] p-4 rounded-2xl transition-all duration-300",
              isSelected
                ? "bg-gradient-primary text-primary-foreground shadow-medium scale-105"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:scale-102"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm font-medium whitespace-nowrap">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
