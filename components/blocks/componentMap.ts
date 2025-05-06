/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextBlock from './text-block';

export type BlockType = 'Text';

export interface Block {
	id: string;
	type: BlockType;
	props: {
		html: string; 
		json: any;
	};
}

export interface Page {
	id: string;
	name: string;
	blocks: Block[];
}

export const componentMap: Record<BlockType, React.ComponentType<any>> = {
	Text: TextBlock,
};
