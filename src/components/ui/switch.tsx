"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-border px-4 py-2 text-sm transition",
        checked ? "bg-brand text-brand-foreground" : "bg-card text-foreground"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full p-1 transition",
          checked ? "bg-foreground/20" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-background transition-transform",
            checked && "translate-x-5"
          )}
        />
      </span>
    </button>
  );
}

