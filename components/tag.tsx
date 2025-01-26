import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TagProps {
  tag: string
  className?: string
}

export function Tag({ tag, className }: TagProps) {
  return (
    <Link
      href={`/inventory?tag=${encodeURIComponent(tag)}`}
      className={cn(
        "inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors",
        className
      )}
    >
      #{tag}
    </Link>
  )
}

