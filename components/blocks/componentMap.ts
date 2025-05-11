/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextBlock from './text-block';
import ImageBlock from './image-block';

export type BlockType = 'Text' | 'Image';

export interface Block {
	id: string;
	type: BlockType;
	props: {
		html: string;
		json: any;
		// Image-specific properties
		imageUrl?: string;
		alt?: string;
		title?: string;
		aspectRatio?: '1/1' | '16/9' | '4/3' | 'auto';
		cornerRadius?: '0' | 'md' | 'full';
		shadow?: 'none' | 'sm' | 'md' | 'lg';
	};
}

export interface Page {
	id: string;
	name: string;
	blocks: Block[];
}

export const componentMap: Record<BlockType, React.ComponentType<any>> = {
	Text: TextBlock,
	Image: ImageBlock,
};
