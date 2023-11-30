import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 
 * @param dataurl 
 * @returns 
 */
export const dataURLtoBuffer = (dataurl: string) => {
  const data = dataurl.split(",")[1];
  return Buffer.from(data, "base64");
};
