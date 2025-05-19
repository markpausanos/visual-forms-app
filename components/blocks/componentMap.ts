/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextBlock from './text-block';
import ImageBlock from './image-block';
import LayoutBlock from './layout-block';
import { AnyBlock } from '@/lib/types/block';

export interface Page {
	id: string;
	name: string;
	blocks: AnyBlock[];
}

export const componentMap: Record<
	AnyBlock['type'],
	React.ComponentType<any>
> = {
	Text: TextBlock,
	Image: ImageBlock,
	Layout: LayoutBlock,
};
