import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Fallback image used when a product has no images. Lives in /public. */
export const PLACEHOLDER_IMAGE = "/placeholder-product.svg"
