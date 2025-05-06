import { Block } from '@/components/blocks/componentMap';
import { TextBlockToolbarWrapper } from './text-block-toolbar-wrapper';

export const blockToolbars: Record<
	string,
	React.ComponentType<{
		block: Block;
		onChange: (updated: Block) => void;
	}>
> = {
	Text: TextBlockToolbarWrapper,
};
