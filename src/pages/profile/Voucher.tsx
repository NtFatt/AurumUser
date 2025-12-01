import { useState, useEffect } from "react";
import { Gift, Calendar, Percent, Coins, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/profile-ui/button";
import { Input } from "@/components/profile-ui/input";
import { Badge } from "@/components/profile-ui/badge";
import { Card } from "@/components/profile-ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/profile-ui/tabs";
import { toast } from "sonner";
import { voucherService, type Voucher } from "@/lib/menu/voucherService";

export default function VoucherPage() {
  const navigate = useNavigate();
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const available = await voucherService.getAvailableVouchers();
      setAvailableVouchers(available);
    } catch (error) {
      console.error("❌ Error loading vouchers:", error);
      toast.error("Không thể tải voucher, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

const VoucherCard = ({ voucher }: { voucher: Voucher }) => (
  <Card className="overflow-hidden hover:shadow-medium transition-all">
    <div className="flex flex-col md:flex-row">

      {/* Left discount block */}
      <div className="bg-gradient-primary p-6 flex items-center justify-center md:w-32">
        <div className="text-center text-primary-foreground">
          {voucher.discountAmount > 0 ? (
            <>
              <Coins className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {voucher.discountAmount.toLocaleString("vi-VN")}đ
              </div>
            </>
          ) : (
            <>
              <Percent className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{voucher.discountPercent}%</div>
            </>
          )}
        </div>
      </div>

      {/* Right info block */}
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg mb-1">{voucher.code}</h3>

            <p className="text-sm text-muted-foreground">
              {voucher.discountAmount > 0
                ? `Giảm ${voucher.discountAmount.toLocaleString("vi-VN")}đ cho đơn hàng`
                : `Giảm ${voucher.discountPercent}% cho đơn hàng`}
            </p>

            {/* Điều kiện đơn tối thiểu */}
            {voucher.minOrderValue > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Áp dụng cho đơn từ {voucher.minOrderValue.toLocaleString("vi-VN")}đ
              </p>
            )}

            {/* Giảm tối đa (chỉ với voucher %) */}
            {voucher.maxDiscountValue > 0 && voucher.discountPercent > 0 && (
              <p className="text-xs text-muted-foreground">
                Giảm tối đa {voucher.maxDiscountValue.toLocaleString("vi-VN")}đ
              </p>
            )}
          </div>

          {voucher.isUsed && <Badge variant="secondary">Đã sử dụng</Badge>}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>HSD: {formatDate(voucher.expiryDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <Coins className="h-4 w-4" />
            <span>{voucher.requiredPoints} điểm</span>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-xl"
          onClick={() => toast.success("Đã lưu voucher vào tài khoản!")}
        >
          Lưu voucher
        </Button>
      </div>
    </div>
  </Card>
);


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Kho Voucher</h1>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Nhập mã voucher tại đây..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10 pr-24 rounded-xl"
            />
            <Button
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl"
              size="sm"
              onClick={() => toast.success(`Đã lưu mã ${searchCode || "voucher"}!`)}
            >
              Lưu
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-6">
            <TabsTrigger value="all">Tất cả ({availableVouchers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
            ) : availableVouchers.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Chưa có voucher nào khả dụng</p>
              </div>
            ) : (
              availableVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
