import { cn } from "@/lib/utils";

export default function RetroGrid({
  className,
  angle = 30,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div 
        className="absolute inset-0 [perspective:1000px]"
        style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
      >
        <div className="absolute inset-0 w-full h-full [transform:rotateX(var(--grid-angle))]">
          <div
            className={cn(
              "absolute inset-0",
              "h-[200%] w-full",
              "[background-size:50px_50px]",
              "animate-[grid-move_20s_linear_infinite]",
              // Light mode grid
              "[background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]",
              // Dark mode grid
              "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)]"
            )}
          />
        </div>
      </div>

      {/* Gradient overlay - adjusted opacity */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/70" />
    </div>
  );
}
