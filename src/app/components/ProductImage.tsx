import Image from 'next/image'

const OPTIMIZED_HOSTS = new Set(['images.unsplash.com'])

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
}) {
  let host = ''
  try {
    host = new URL(src).hostname
  } catch {
    host = ''
  }

  if (!OPTIMIZED_HOSTS.has(host)) {
    return (
      <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className ?? ''}`} />
    )
  }

  return <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />
}
