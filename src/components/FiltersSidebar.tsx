import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Category, SubCategory, Brand, FilterState } from "@/config/types";

interface FiltersSidebarProps {
  categories: Category[];
  subCategories: SubCategory[];
  brands: Brand[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
  forceDialog?: boolean;
}

const FiltersSidebar = ({
  categories,
  subCategories,
  brands,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
  forceDialog = false,
}: FiltersSidebarProps) => {
  // Get subcategories for the currently selected category
  const filteredSubCategories = useMemo(() => {
    if (!filters.categoryId) return subCategories;
    return subCategories.filter(sub => sub.categoryId === filters.categoryId);
  }, [subCategories, filters.categoryId]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string | null) => {
    // Reset subcategory when changing category
    onFilterChange({
      ...filters,
      categoryId,
      subCategoryId: null
    });
  };

  // Handle subcategory selection
  const handleSubCategoryChange = (subCategoryId: string | null) => {
    onFilterChange({
      ...filters,
      subCategoryId
    });
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string | null) => {
    onFilterChange({
      ...filters,
      brandId
    });
  };

  // Handle sort change
  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      categoryId: null,
      subCategoryId: null,
      brandId: null,
      searchQuery: filters.searchQuery, // Preserve search query
      sortBy: null
    });
  };

  // Check if any filter is applied
  const hasActiveFilters = !!(filters.categoryId || filters.subCategoryId || filters.brandId || filters.sortBy);

  // Filter button content for mobile
  const FilterButton = (
    <Button 
      onClick={onToggle}
      variant="outline" 
      className="w-full flex items-center justify-between"
    >
      <span className="flex items-center">
        <Filter size={16} className="mr-2" />
        Filters & Categories
      </span>
      {hasActiveFilters && (
        <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          !
        </span>
      )}
    </Button>
  );
  
  // Filter content
  const FiltersContent = (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          className={!hasActiveFilters ? 'opacity-50 cursor-not-allowed' : ''}
        >
          <X size={16} className="mr-1" /> Clear All
        </Button>
      </div>

      {/* Sort options */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Sort By</h3>
        <Select 
          value={filters.sortBy || "all"} 
          onValueChange={(value) => handleSortChange(value as FilterState['sortBy'] || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="single" collapsible defaultValue="categories" className="w-full">
        {/* Shop by Category */}
        <AccordionItem value="categories">
          <AccordionTrigger>Shop by Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Button
                variant={filters.categoryId === null ? "secondary" : "outline"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleCategoryChange(null)}
              >
                All Categories
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.categoryId === category.id ? "secondary" : "outline"}
                  size="sm"
                  className="w-full justify-start text-left py-2 h-auto" // Added proper padding
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <p className="break-words overflow-wrap-break-word whitespace-normal w-full">
                    {category.name}
                  </p>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
          
        {/* Shop by Subcategory - only show if category is selected and there are subcategories */}
        {filteredSubCategories.length > 0 && (
          <AccordionItem value="subcategories">
            <AccordionTrigger>Shop by Subcategory</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Button
                  variant={filters.subCategoryId === null ? "secondary" : "outline"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => handleSubCategoryChange(null)}
                >
                  All Subcategories
                </Button>
                
                {filteredSubCategories.map((subCategory) => (
                  <Button
                    key={subCategory.id}
                    variant={filters.subCategoryId === subCategory.id ? "secondary" : "outline"}
                    size="sm"
                    className="w-full justify-start text-left py-2 h-auto"
                    onClick={() => handleSubCategoryChange(subCategory.id)}
                  >
                    <p className="break-words overflow-wrap-break-word whitespace-normal w-full">{subCategory.name}</p>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Shop by Brand */}
        <AccordionItem value="brands">
          <AccordionTrigger>Shop by Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Button
                variant={filters.brandId === null ? "secondary" : "outline"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleBrandChange(null)}
              >
                All Brands
              </Button>
              
              {brands.map((brand) => (
                <Button
                  key={brand.id}
                  variant={filters.brandId === brand.id ? "secondary" : "outline"}
                  size="sm"
                  className="w-full justify-start text-left py-2 h-auto"
                  onClick={() => handleBrandChange(brand.id)}
                >
                  <p className="break-words overflow-wrap-break-word whitespace-normal w-full">{brand.brandName}</p>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // We'll use Dialog for mobile view and a regular sidebar for desktop
  return (
    <>
      {/* Mobile filter button */}
      {!forceDialog && (
        <div className="md:hidden sticky top-16 z-10 bg-white pb-2">
          {FilterButton}
        </div>
      )}

      {/* Mobile: Dialog for filters */}
      <Dialog open={isOpen && (window.innerWidth < 768 || forceDialog)} onOpenChange={onToggle}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] p-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>Filters & Categories</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto -mr-4 pr-4">
            {FiltersContent}
          </div>
          
          {/* <DialogFooter className="mt-4">
            <Button onClick={onToggle} className="w-full bg-[#624d15] hover:bg-amber-800">
              Apply Filters
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      {!forceDialog && (
        <aside className="hidden md:block bg-white w-64 min-w-64 rounded-lg border p-4 h-fit">
          {FiltersContent}
        </aside>
      )}
    </>
  );
};

export default FiltersSidebar;