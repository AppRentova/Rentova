import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none ring-0 transition placeholder:text-muted-foreground focus:border-brand",
        className
      )}
      {...props}
    />
  );
}

