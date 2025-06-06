import { AnyBlock, type ColumnBlock, TextBlock } from '@/lib/types/block';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableBlock from '../flows/draggable-block';
import { ArrowDownToLine } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function ColumnBlock({
	block,
	onChange,
	onSelect,
	onAddBelow,
	selectedBlockId,
}: {
	block: ColumnBlock;
	onChange: (updated: ColumnBlock) => void;
	onSelect: (block: AnyBlock) => void;
	onAddBelow: (blockId: string) => void;
	selectedBlockId: string | null;
}) {
	const { padding, backgroundColor } = block.props;
	const children = Array.isArray(block.children) ? block.children : [];

	// Make the column droppable with a higher activation priority
	const { setNodeRef, isOver } = useDroppable({
		id: block.id,
		data: {
			type: 'Column',
			accepts: ['Text', 'Image', 'Layout'],
			isContainer: true,
			childIds: children.map((child) => child.id),
			parentType: 'ColumnWrapper', // Ensure this block knows it belongs in a ColumnWrapper
		},
	});

	// Handle block updates
	const handleBlockChange = (updated: AnyBlock, idx: number) => {
		const newChildren = [...children];
		newChildren[idx] = updated;
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Handle deleting a block
	const handleDeleteBlock = (blockId: string) => {
		const newChildren = children.filter((child) => child.id !== blockId);
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Create a default text block
	const createDefaultTextBlock = () => {
		const textBlock: TextBlock = {
			id: uuidv4(),
			type: 'Text',
			props: {
				html: '<p>Add text here</p>',
				textAlign: 'text-left',
				size: 'text-base',
			},
		};

		onChange({
			...block,
			children: [...children, textBlock],
		});
	};

	// Handle selecting a block - critical for toolbar to show
	const handleBlockSelect = (childBlock: AnyBlock) => {
		// When a child block is selected, just pass it up without modification
		// This ensures the actual child block gets selected, not the column
		onSelect(childBlock);
	};

	// Handle column selection
	const handleColumnSelect = (e: React.MouseEvent) => {
		// Only select the column if the click is directly on it, not on a child
		if (
			e.target === e.currentTarget ||
			(e.target as HTMLElement).classList.contains('column-select-target')
		) {
			e.stopPropagation();
			onSelect(block);
		}
	};

	const isSelected = selectedBlockId === block.id;

	return (
		<div
			ref={setNodeRef}
			className={cn(
				'flex flex-col w-full h-full min-h-[100px] rounded-md transition-colors duration-200 border',
				isSelected ? 'border-primary' : 'border-gray-200',
				isOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : '',
				backgroundColor ? `bg-${backgroundColor}` : ''
			)}
			style={{ padding: `${padding || 16}px` }}
			onClick={handleColumnSelect}
			data-column-id={block.id}
		>
			{children.length === 0 ? (
				<div
					className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm h-full gap-2 column-select-target cursor-pointer"
					onClick={createDefaultTextBlock}
				>
					<ArrowDownToLine className="w-8 h-8 opacity-50" />
					<p>Click to add text block</p>
				</div>
			) : (
				<SortableContext
					items={children.map((child) => child.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-4 w-full h-full">
						{children.map((child, idx) => (
							<DraggableBlock
								key={child.id}
								block={child}
								selectedBlockId={selectedBlockId}
								onSelect={handleBlockSelect}
								onChange={(updated) => handleBlockChange(updated, idx)}
								onAddBelow={() => onAddBelow(child.id)}
								onDelete={handleDeleteBlock}
								parentBlockId={block.id}
							/>
						))}
					</div>
				</SortableContext>
			)}
		</div>
	);
}
