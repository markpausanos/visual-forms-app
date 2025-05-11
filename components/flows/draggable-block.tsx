'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, componentMap } from '../blocks/componentMap';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableBlockProps {
	block: Block;
	isSelected: boolean;
	onSelect: (block: Block) => void;
	onChange: (updated: Block) => void;
}

export default function DraggableBlock({
	block,
	isSelected,
	onSelect,
	onChange,
}: DraggableBlockProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: block.id,
		animateLayoutChanges: () => false, // Custom animation handling
	});

	const BlockComponent = componentMap[block.type];

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (!BlockComponent) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="text-red-500 p-2 rounded border border-red-300"
			>
				Unsupported block: {block.type}
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			data-dragging={isDragging}
			className={cn(
				'sortable-block relative group rounded-md transition-all',
				isDragging ? 'z-10 opacity-50' : 'opacity-100',
				isSelected ? 'block-selected' : ''
			)}
			onClick={(e) => {
				e.stopPropagation();
				onSelect(block);
			}}
		>
			{/* Drag handle */}
			<div
				{...attributes}
				{...listeners}
				className="drag-handle absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-8 flex items-center px-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
				title="Drag to reorder"
			>
				<GripVertical size={18} className="text-gray-400 hover:text-gray-600" />
			</div>

			{/* Block content */}
			<div
				className={cn(
					'block-wrapper p-2 relative',
					isSelected ? 'bg-gray-50 rounded-md' : ''
				)}
			>
				<BlockComponent block={block} onChange={onChange} />
			</div>
		</div>
	);
}
