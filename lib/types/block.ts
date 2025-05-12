interface Block<T extends string, P> {
	id: string;
	type: T;
	props: P;
}

export type TextBlockProps = {
	html: string;
	textAlign?: 'text-left' | 'text-center' | 'text-right';
	size?: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
};

export type ImageBlockProps = {
	src: string;
	alt?: string;
	href?: string;
	aspectRatio?: 'aspect-auto' | 'aspect-square' | 'aspect-video';
	cornerRadius?: 'rounded-none' | 'rounded-md' | 'rounded-full';
	shadow?: 'shadow-none' | 'shadow-sm' | 'shadow-md' | 'shadow-lg';
};

// Create specific block types
export type TextBlock = Block<'Text', TextBlockProps>;
export type ImageBlock = Block<'Image', ImageBlockProps>;

// Union type for all blocks
export type AnyBlock = TextBlock | ImageBlock;
