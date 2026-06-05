import { cn } from '@/lib/utils'

export const BRAND_LOGO_SRC = '/assets/plane-logo.png'

type BrandLogoIconProps = {
  className?: string
  width?: number
  height?: number
}

export function BrandLogoIcon({ className, width = 24, height = 24 }: BrandLogoIconProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt=""
      aria-hidden="true"
      className={cn('brand-logo-img', className)}
      width={width}
      height={height}
      decoding="async"
    />
  )
}
