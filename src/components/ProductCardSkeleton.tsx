import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder that mirrors the real ProductCard layout so the grid keeps its
 * shape while data loads (no layout shift when products arrive).
 */
const ProductCardSkeleton = () => (
  <Card className="overflow-hidden w-full pt-0 pb-2 bg-[#fffbf4] gap-1 h-full flex flex-col rounded-xl">
    <AspectRatio ratio={1 / 1} className="bg-[#f5ece0]">
      <Skeleton className="w-full h-full rounded-none" />
    </AspectRatio>
    <CardContent className="p-2 md:p-4 flex flex-col flex-1 gap-2">
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
      <div className="mt-auto pt-2 w-full flex items-center justify-around">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-4 w-14" />
      </div>
    </CardContent>
  </Card>
);

export default ProductCardSkeleton;
