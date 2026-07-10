import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatSar(value: number): string {
  return `${value.toLocaleString("ar-SA", { maximumFractionDigits: 0 })} ر.س`;
}
