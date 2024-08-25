"use client";
import { useSearchParams } from "next/navigation";
import { categories } from "./utils/categories";
import ProductCard from "./components/home/ProductCard";
import { Product, Review } from "@prisma/client";
type ProductType = Product & {
  reviews: Review[];
};
interface ProductSectionProps {
  products: ProductType[];
}
export const ProductsSection: React.FC<ProductSectionProps> = ({
  products,
}) => {
  if (products.length === 0) {
    return (
      <h2 className="text-center text-xl">
        Oops!, No products found click all to clear filter
      </h2>
    );
  }
  return (
    <section className="grid xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </section>
  );
};