import {
	AnyBlock,
	ColumnBlock,
	type ColumnWrapperBlock,
} from '@/lib/types/block';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableBlock from '../flows/draggable-block';
import { Plus, Columns } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';

export default function ColumnWrapperBlock({
	block,
	onChange,
	onSelect,
	onAddBelow,
	selectedBlockId,
	previewMode = 'desktop',
}: {
	block: ColumnWrapperBlock;
	onChange: (updated: ColumnWrapperBlock) => void;
	onSelect: (block: AnyBlock) => void;
	onAddBelow: (blockId: string) => void;
	selectedBlockId: string | null;
	previewMode?: 'desktop' | 'mobile';
}) {
	const MAX_COLUMNS = 4;
	const gap = block.props.gap || 16;
	const children = Array.isArray(block.children) ? block.children : [];

	// Determine columns based on preview mode and existing children
	const isMobile = previewMode === 'mobile';
	const columnsToDisplay = isMobile
		? 1
		: Math.min(children.length || 1, MAX_COLUMNS);

	// Make the wrapper droppable
	const { setNodeRef, isOver } = useDroppable({
		id: block.id,
		data: {
			type: 'ColumnWrapper',
			accepts: ['Text', 'Image', 'Layout', 'Column'], // Accept any block type - will be auto-wrapped in a Column
			isColumnContainer: true,
			maxChildren: MAX_COLUMNS,
		},
	});

	// Handle block updates
	const handleBlockChange = (updated: AnyBlock, idx: number) => {
		const newChildren = [...children];
		newChildren[idx] = updated as ColumnBlock;
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Handle deleting a column
	const handleDeleteBlock = (blockId: string) => {
		const newChildren = children.filter((child) => child.id !== blockId);
		onChange({
			...block,
			children: newChildren,
		});
	};

	// Handle selecting a block
	const handleBlockSelect = (block: AnyBlock) => {
		onSelect(block);
	};

	// Handle adding a new column
	const handleAddColumn = () => {
		// Don't allow more than MAX_COLUMNS columns
		if (children.length >= MAX_COLUMNS) {
			return;
		}

		// Create a new column block
		const newColumn = {
			id: uuidv4(),
			type: 'Column',
			props: {
				backgroundColor: 'transparent',
				padding: 16,
			},
			children: [],
		};

		// Add it to the children
		onChange({
			...block,
			children: [...children, newColumn as ColumnBlock],
		});
	};

	const isSelected = selectedBlockId === block.id;

	return (
		<div
			className={cn('w-full mx-auto max-w-5xl', isSelected ? 'relative' : '')}
			ref={setNodeRef}
			onClick={(e) => {
				e.stopPropagation();
				onSelect(block);
			}}
		>
			<div
				className={cn(
					'w-full p-4 rounded-md transition-colors duration-200',
					isOver ? 'bg-blue-50 border border-blue-300' : '',
					isSelected
						? 'border border-dashed border-primary'
						: 'border border-transparent',
					block.props.backgroundColor ? `bg-${block.props.backgroundColor}` : ''
				)}
			>
				{isSelected && (
					<div className="absolute -top-8 left-0 text-xs bg-primary text-white px-2 py-1 rounded-t-md flex items-center">
						<Columns className="w-3 h-3 mr-1" />
						Column Wrapper ({children.length}/{MAX_COLUMNS})
						{isMobile && <span className="ml-2">(Mobile View)</span>}
					</div>
				)}

				<div
					className="grid gap-4 w-full relative"
					style={{
						gap: `${gap}px`,
						gridTemplateColumns: `repeat(${columnsToDisplay}, 1fr)`,
					}}
				>
					{children.length === 0 && (
						<div className="col-span-full text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-md">
							Add columns here
						</div>
					)}

					<SortableContext
						items={children.map((child) => child.id)}
						strategy={horizontalListSortingStrategy}
					>
						{children.map((child, idx) => (
							<div key={child.id} className="min-w-0">
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

					{isSelected && children.length < MAX_COLUMNS && (
						<Button
							variant="outline"
							className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white"
							onClick={handleAddColumn}
						>
							<Plus size={16} />
							Add Column
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
