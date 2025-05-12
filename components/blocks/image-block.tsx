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
	} = block.props;

	const imageElement = (
		<img
			src={src}
			alt={alt || ''}
			className={cn(
				'w-full h-auto object-cover transition-all duration-200',
				aspectRatio,
				cornerRadius,
				shadow,
				fullWidth ? 'w-full' : 'w-auto',
				fullHeight ? 'h-full' : 'h-auto'
			)}
		/>
	);

	return (
		<div className="image-block-container">
			{href ? (
				<a href={href} target="_blank" rel="noopener noreferrer">
					{imageElement}
				</a>
			) : (
				imageElement
			)}
		</div>
	);
}
