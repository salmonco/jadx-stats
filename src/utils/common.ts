import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

type AnyFunction = (...args: unknown[]) => void;

export const throttle = <T extends AnyFunction>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | undefined;

  return function (...args: Parameters<T>): void {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan! >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
};

export const getRowSpan = (data: unknown[], index: number, key: string) => {
  if (index === 0 || data[index][key] !== data[index - 1][key]) {
    let count = 1;
    for (let i = index + 1; i < data.length; i++) {
      if (data[i][key] === data[index][key]) count++;
      else break;
    }
    return count;
  }
  return 0;
};

export const PRIV_AUTH = new Set(["농협", "수급관리센터"]);
export const ADMIN_AUTH = new Set(["관리자"]);
