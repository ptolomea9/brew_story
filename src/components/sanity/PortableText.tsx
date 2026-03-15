'use client';

/**
 * Portable text renderer for Sanity rich text content.
 * Placeholder until @portabletext/react is installed with Sanity Studio.
 */
interface PortableTextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  className?: string;
}

export default function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value || !Array.isArray(value)) return null;

  return (
    <div className={`prose prose-olive max-w-none ${className}`}>
      {value.map((block, i) => {
        if (block._type === 'block') {
          const Tag = block.style === 'h2' ? 'h2' :
                      block.style === 'h3' ? 'h3' :
                      block.style === 'h4' ? 'h4' :
                      block.style === 'blockquote' ? 'blockquote' : 'p';

          const text = block.children
            ?.map((child: { text: string }) => child.text)
            .join('') || '';

          return <Tag key={block._key || i}>{text}</Tag>;
        }
        return null;
      })}
    </div>
  );
}
