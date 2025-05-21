import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes conditionally and resolves class conflicts.
 *
 * @param inputs - A list of class names, conditionals, arrays, or objects.
 * @returns A single, merged class string optimized for Tailwind CSS.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs));
}
