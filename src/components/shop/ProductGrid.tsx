import ScrollReveal from '@/components/animation/ScrollReveal';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image?: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, i) => (
        <ScrollReveal key={product.id} delay={i * 0.1}>
          <ProductCard product={product} />
        </ScrollReveal>
      ))}
    </div>
  );
}
