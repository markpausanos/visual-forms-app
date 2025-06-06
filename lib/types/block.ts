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
	aspectRatio?:
		| 'aspect-auto'
		| 'aspect-square'
		| 'aspect-video'
		| 'aspect-ratio: 9/16';
	cornerRadius?: number;
	shadow?: number;
	fullWidth?: boolean;
	fullHeight?: boolean;
	fullSize?: boolean;
};

export type LayoutBlockProps = {
	gap?: number;
};

export type ColumnWrapperBlockProps = {
	gap?: number;
	backgroundColor?: string;
};

export type ColumnBlockProps = {
	padding?: number;
	backgroundColor?: string;
};

// Create specific block types
export type TextBlock = Block<'Text', TextBlockProps>;
export type ImageBlock = Block<'Image', ImageBlockProps>;
export interface LayoutBlock extends Block<'Layout', LayoutBlockProps> {
	children: AnyBlock[];
}
export interface ColumnWrapperBlock
	extends Block<'ColumnWrapper', ColumnWrapperBlockProps> {
	children: ColumnBlock[];
}
export interface ColumnBlock extends Block<'Column', ColumnBlockProps> {
	children: AnyBlock[];
}

// Union type for all blocks
export type AnyBlock =
	| TextBlock
	| ImageBlock
	| LayoutBlock
	| ColumnWrapperBlock
	| ColumnBlock;
