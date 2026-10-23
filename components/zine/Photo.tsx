import type { ImgHTMLAttributes } from "react";

// Serves the WebP sibling of a .jpg (same path, .webp extension) with the JPEG as fallback.
export default function Photo({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const webp = src.replace(/\.jpe?g$/i, ".webp");
  return (
    <picture>
      {webp !== src && <source srcSet={webp} type="image/webp" />}
      <img src={src} alt={alt} decoding="async" {...rest} />
    </picture>
  );
}
