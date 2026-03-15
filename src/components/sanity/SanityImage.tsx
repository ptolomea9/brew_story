import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface SanityImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export default function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  fill = false,
  className = '',
  priority = false,
}: SanityImageProps) {
  if (!image?.asset) {
    return <div className={`bg-linen ${className}`} />;
  }

  const url = urlFor(image).width(width).height(height).auto('format').url();

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
