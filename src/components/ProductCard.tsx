import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
  category?: string;
  onAddToCart: () => void;
}

export const ProductCard = ({
  name,
  price,
  image,
  rating,
  discount,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      {discount && (
        <Badge className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground px-3 py-1">
          {discount}% off
        </Badge>
      )}
      
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? 'fill-accent text-accent'
                  : 'fill-muted text-muted-foreground'
              }`}
            />
          ))}
        </div>

        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discount && (
              <span className="text-sm text-muted-foreground line-through">
                ${price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              ${discount ? ((price * (100 - discount)) / 100).toFixed(2) : price.toFixed(2)}
            </span>
          </div>

          <Button
            size="icon"
            className="rounded-xl bg-primary hover:bg-primary-dark shadow-medium"
            onClick={onAddToCart}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
