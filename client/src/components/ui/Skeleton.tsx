import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
  count?: number
}

export default function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-primary-800 rounded-lg animate-skeleton-loading',
            className
          )}
        />
      ))}
    </>
  )
}
