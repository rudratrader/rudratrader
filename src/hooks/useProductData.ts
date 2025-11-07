import { useState, useEffect } from "react";
import axios from "axios";
import { Brand, Category, SubCategory, EnhancedProduct } from "@/config/types";

export const useProductData = () => {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(import.meta.env.VITE_DATA_URL);
        const data = response.data;

        if (data.success) {
          // Transform products to match EnhancedProduct structure
          const enhancedProducts: EnhancedProduct[] = data.products
            .filter((product: any) => product.name)
            .map((product: any) => ({
              id: product._id,
              name: product.name,
              price: product.price || 0,
              images: product.images || [],
              brandId: product.brandId._id,
              brandName: product.brandId.brandName,
              categoryId: product.categoryId._id,
              categoryName: product.categoryId.categoryName,
              quantity: product.quantity || "N/A",
              description: product.description || "",
              status: product.status
            }));

          // Transform brands
          const transformedBrands = data.brands.map((brand: any) => ({
            id: brand._id,
            brandName: brand.brandName
          }));

          // Transform categories
          const transformedCategories = data.categories.map((category: any) => ({
            id: category._id,
            categoryName: category.categoryName
          }));

          // Update state with transformed data
          setProducts(enhancedProducts);
          setBrands(transformedBrands);
          setCategories(transformedCategories);
          setSubCategories([]); // No subcategories in your data structure
        } else {
          setError(data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, brands, categories, subCategories, loading, error };
};