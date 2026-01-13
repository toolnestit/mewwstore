import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent animate-pulse rounded-md bg-[#e5e7eb]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
