import { Block } from '@/components/blocks/componentMap';
import { TextBlockToolbarWrapper } from './text-block-toolbar-wrapper';
import { ImageBlockToolbarWrapper } from './image-block-toolbar-wrapper';

export const blockToolbars: Record<
	string,
	React.ComponentType<{
		block: Block;
		onChange: (id: string, html: string) => void;
	}>
> = {
	Text: TextBlockToolbarWrapper,
	Image: ImageBlockToolbarWrapper,
};
