import { AnyBlock } from '@/lib/types/block';
import { TextBlockToolbarWrapper } from './text-block-toolbar-wrapper';
import { ImageBlockToolbarWrapper } from './image-block-toolbar-wrapper';

export const blockToolbars: Record<
	string,
	React.ComponentType<{
		block: AnyBlock;
		onChange: (id: string, updatedProps: Partial<AnyBlock['props']>) => void;
		openImageSelector?: (blockId: string) => void;
	}>
> = {
	Text: TextBlockToolbarWrapper as React.ComponentType<{
		block: AnyBlock;
		onChange: (id: string, updatedProps: Partial<AnyBlock['props']>) => void;
		openImageSelector?: (blockId: string) => void;
	}>,
	Image: ImageBlockToolbarWrapper as React.ComponentType<{
		block: AnyBlock;
		onChange: (id: string, updatedProps: Partial<AnyBlock['props']>) => void;
		openImageSelector?: (blockId: string) => void;
	}>,
};
