import { arrayMove } from '@dnd-kit/sortable';
import { Page } from '@/components/blocks/componentMap';

export function reorderBlocks(
	pages: Page[],
	activePageIndex: number,
	oldIndex: number,
	newIndex: number
): Page[] {
	const newPages = [...pages];

	// Get the current page
	const activePage = { ...newPages[activePageIndex] };

	// Reorder the blocks using arrayMove
	activePage.blocks = arrayMove(activePage.blocks, oldIndex, newIndex);

	// Update the page with reordered blocks
	newPages[activePageIndex] = activePage;

	return newPages;
}
