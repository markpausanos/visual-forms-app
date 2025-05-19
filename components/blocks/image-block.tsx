'use client';

import { type ImageBlock } from '@/lib/types/block';
import { cn } from '@/lib/utils';

export default function ImageBlock({ block }: { block: ImageBlock }) {
	const {
		src,
		alt,
		href,
		cornerRadius,
		shadow,
		aspectRatio,
		fullWidth,
		fullHeight,
		fullSize,
	} = block.props;

	const imageElement = (
		<img
			src={src}
			alt={alt || ''}
			style={{
				borderRadius: cornerRadius ? `${cornerRadius}px` : undefined,
				boxShadow: shadow
					? `0 4px 12px rgba(0, 0, 0, ${shadow / 100})`
					: undefined,
			}}
			className={cn(
				'object-cover transition-all duration-200',
				aspectRatio,
				fullWidth || fullSize ? 'w-full' : 'w-auto',
				fullHeight || fullSize ? 'h-full' : 'h-auto'
			)}
		/>
	);

	return (
		<div className="flex items-center justify-center w-full max-w-xl mx-auto">
			{href ? (
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center"
				>
					{imageElement}
				</a>
			) : (
				imageElement
			)}
		</div>
	);
}
