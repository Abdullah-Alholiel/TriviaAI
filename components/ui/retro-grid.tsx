import { cn } from "@/lib/utils";

export default function RetroGrid({
  className,
  angle = 50,
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
              "animate-grid",
              "[background-size:60px_60px]",
              "h-[200%] w-full",
              // Light mode grid
              "[background-image:linear-gradient(to_right,rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.8)_1px,transparent_1px)]",
              // Dark mode grid
              "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)]"
            )}
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent dark:from-black/70" />
    </div>
  );
}
