import { AnyBlock, type LayoutBlock } from '@/lib/types/block';
import DraggableBlock from '../flows/draggable-block';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

export default function LayoutBlock({
	block,
	onChange,
	onSelect,
	onAddBelow,
	selectedBlockId,
}: {
	block: LayoutBlock;
	onChange: (updated: LayoutBlock) => void;
	onSelect: (block: AnyBlock) => void;
	onAddBelow: (blockId: string) => void;
	selectedBlockId: string | null;
}) {
	const gap = block.props?.gap || 16;
	const children = Array.isArray(block.children) ? block.children : [];
	const isSingle = children.length === 1;
	const isOddNumber = children.length % 2 !== 0;

	// Make the layout droppable
	const { setNodeRef, isOver } = useDroppable({
		id: block.id,
	});

	// Compute span at render time
	const getSpan = (index: number) => {
		if (isSingle) return 2; // Single column takes full width
		if (isOddNumber && index === children.length - 1) return 2; // Last column in odd-numbered layout takes full width
		return 1; // All other columns take single span
	};

	// Handle deleting a block
	const handleDeleteBlock = (blockId: string) => {
		const newChildren = children.filter((child) => child.id !== blockId);
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Handle block updates
	const handleBlockChange = (updated: AnyBlock, idx: number) => {
		const newChildren = [...children];
		newChildren[idx] = updated;
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Handle block selection
	const handleBlockSelect = (block: AnyBlock) => {
		// First select the child block
		onSelect(block);
	};

	return (
		<div
			className="w-full flex mx-auto max-w-5xl"
			ref={setNodeRef}
			onClick={(e) => {
				// Prevent click from bubbling to parent when clicking on the layout itself
				// This way clicking on the layout selects the layout, not clears selection
				e.stopPropagation();
				onSelect(block);
			}}
		>
			<div
				className={`grid w-full gap-4 p-6 ${
					isOver ? 'bg-blue-50 rounded-md transition-colors duration-200' : ''
				}`}
				style={{
					gap: `${gap}px`,
					gridTemplateColumns: 'repeat(2, 1fr)',
				}}
			>
				{children.length === 0 && (
					<div className="col-span-2 text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-md">
						Drag blocks here
					</div>
				)}

				<SortableContext
					items={children.map((child) => child.id)}
					strategy={verticalListSortingStrategy}
				>
					{children.map((child, idx) => (
						<div
							key={child.id}
							className="min-w-0"
							style={{
								gridColumn: `span ${getSpan(idx)}`,
							}}
						>
							<DraggableBlock
								block={child}
								selectedBlockId={selectedBlockId}
								onSelect={handleBlockSelect}
								onChange={(updated) => handleBlockChange(updated, idx)}
								onAddBelow={() => onAddBelow(child.id)}
								onDelete={handleDeleteBlock}
								parentBlockId={block.id}
							/>
						</div>
					))}
				</SortableContext>
			</div>
		</div>
	);
}
