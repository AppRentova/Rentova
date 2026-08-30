import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-brand",
        className
      )}
      {...props}
    />
  );
}

