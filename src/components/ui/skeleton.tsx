import { cn } from "@/lib/utils"

/**
 * Base shimmer block for skeleton loaders.
 * Uses a warm tone so it reads well on the cream surfaces, and the
 * built-in `animate-pulse` (from tailwindcss-animate) for the shimmer.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-[#e8ddcb]", className)}
      {...props}
    />
  )
}

export { Skeleton }
