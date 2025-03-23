import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Product, Brand, Category, SubCategory, EnhancedProduct } from "@/config/types";

export const useProductData = () => {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // URLs for each sheet (using environment variables or direct URLs)
        const productsUrl = import.meta.env.VITE_PRODUCTS_SHEET_URL;
        const brandsUrl = import.meta.env.VITE_BRANDS_SHEET_URL;
        const categoriesUrl = import.meta.env.VITE_CATEGORIES_SHEET_URL;
        const subCategoriesUrl = import.meta.env.VITE_SUBCATEGORIES_SHEET_URL;

        // Fetch all sheets in parallel
        const [productsResp, brandsResp, categoriesResp, subCategoriesResp] = await Promise.all([
          axios.get(productsUrl, { responseType: "blob" }),
          axios.get(brandsUrl, { responseType: "blob" }),
          axios.get(categoriesUrl, { responseType: "blob" }),
          axios.get(subCategoriesUrl, { responseType: "blob" })
        ]);

        // Parse products data
        const productsPromise = new Promise<Product[]>((resolve) => {
          Papa.parse(productsResp.data, {
            header: true,
            complete: (results) => {
              const parsedProducts = results.data
                .filter((item: any) => item.id && item.name && item.status === 'a')
                .map((item: any) => ({
                  id: String(item.id || ""),
                  name: String(item.name || ""),
                  price: Number(item.price || 0),
                  image: String(item.image || "").trim(),
                  brandId: String(item.brandId || ""),
                  categoryId: String(item.categoryId || ""),
                  subCategoryId: String(item.subCategoryId || ""),
                  quantity: String(item.quantity || "N/A"),
                  description: String(item.description || ""),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt
                }));
              resolve(parsedProducts);
            },
            error: () => resolve([])
          });
        });

        // Parse brands data
        const brandsPromise = new Promise<Brand[]>((resolve) => {
          Papa.parse(brandsResp.data, {
            header: true,
            complete: (results) => {
              const parsedBrands = results.data
                .filter((item: any) => item.id && item.brandName)
                .map((item: any) => ({
                  id: String(item.id || ""),
                  brandName: String(item.brandName || ""),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt
                }));
              resolve(parsedBrands);
            },
            error: () => resolve([])
          });
        });

        // Parse categories data
        const categoriesPromise = new Promise<Category[]>((resolve) => {
          Papa.parse(categoriesResp.data, {
            header: true,
            complete: (results) => {
              const parsedCategories = results.data
                .filter((item: any) => item.id && item.name)
                .map((item: any) => ({
                  id: String(item.id || ""),
                  name: String(item.name || ""),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt
                }));
              resolve(parsedCategories);
            },
            error: () => resolve([])
          });
        });

        // Parse subcategories data
        const subCategoriesPromise = new Promise<SubCategory[]>((resolve) => {
          Papa.parse(subCategoriesResp.data, {
            header: true,
            complete: (results) => {
              const parsedSubCategories = results.data
                .filter((item: any) => item.id && item.name && item.categoryId)
                .map((item: any) => ({
                  id: String(item.id || ""),
                  name: String(item.name || ""),
                  categoryId: String(item.categoryId || ""),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt
                }));
              resolve(parsedSubCategories);
            },
            error: () => resolve([])
          });
        });

        // Wait for all parsing to complete
        const [productsList, brandsList, categoriesList, subCategoriesList] = await Promise.all([
          productsPromise,
          brandsPromise,
          categoriesPromise,
          subCategoriesPromise
        ]);

        // Create lookup maps for quick access
        const brandsMap: Record<string, Brand> = {};
        const categoriesMap: Record<string, Category> = {};
        const subCategoriesMap: Record<string, SubCategory> = {};

        brandsList.forEach(brand => {
          brandsMap[brand.id] = brand;
        });

        categoriesList.forEach(category => {
          categoriesMap[category.id] = category;
        });

        subCategoriesList.forEach(subCategory => {
          subCategoriesMap[subCategory.id] = subCategory;
        });

        // Create enhanced products with related data
        const enhancedProducts: EnhancedProduct[] = productsList.map(product => {
          const brand = brandsMap[product.brandId] || { brandName: 'Unknown' };
          const category = categoriesMap[product.categoryId] || { name: 'Unknown' };
          const subCategory = subCategoriesMap[product.subCategoryId] || { name: 'N/A' };

          return {
            ...product,
            brandName: brand.brandName,
            categoryName: category.name,
            subCategoryName: subCategory.name,
            imageArray: product.image.split(',').map(img => img.trim())
          };
        });

        // Update state with all fetched data
        setProducts(enhancedProducts);
        setBrands(brandsList);
        setCategories(categoriesList);
        setSubCategories(subCategoriesList);
      } catch (err) {
        console.error("Error fetching or parsing data:", err);
        setError("Failed to load product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { products, brands, categories, subCategories, loading, error };
};