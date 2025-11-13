import * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-[hsl(var(--apple-fill)/0.1)]", className)} {...props} />;
}

interface FlashcardSkeletonProps {
  className?: string;
}

function FlashcardSkeleton({ className }: FlashcardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-[hsl(var(--apple-grouped-bg))] rounded-xl border border-[hsl(var(--apple-separator-opaque))] shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Badge skeleton */}
      <div className="px-4 pt-4 pb-2">
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>

      {/* Card content skeleton */}
      <div className="p-4 space-y-4">
        {/* Front section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Divider */}
        <Skeleton className="h-px w-full" />

        {/* Back section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

interface StatsSkeletonProps {
  className?: string;
}

function StatsSkeleton({ className }: StatsSkeletonProps) {
  return (
    <div
      className={cn(
        "text-center p-6 bg-[hsl(var(--apple-grouped-bg-secondary))] rounded-xl border border-[hsl(var(--apple-separator-opaque))]",
        className
      )}
    >
      <div className="space-y-4">
        <Skeleton className="w-16 h-16 mx-auto rounded-full" />
        <Skeleton className="h-12 w-24 mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>
    </div>
  );
}

interface FeatureSkeletonProps {
  className?: string;
}

function FeatureSkeleton({ className }: FeatureSkeletonProps) {
  return (
    <div
      className={cn(
        "p-6 bg-[hsl(var(--apple-grouped-bg-secondary))] rounded-xl border border-[hsl(var(--apple-separator-opaque))]",
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, FlashcardSkeleton, StatsSkeleton, FeatureSkeleton };
