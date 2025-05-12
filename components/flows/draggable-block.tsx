'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { componentMap } from '../blocks/componentMap';
import { GripVertical, Plus, Pencil, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnyBlock } from '@/lib/types/block';
import { Button } from '@/components/ui/button';

interface DraggableBlockProps {
	block: AnyBlock;
	isSelected: boolean;
	onSelect: (block: AnyBlock) => void;
	onChange: (updated: AnyBlock) => void;
	onAddBelow?: (blockId: string) => void;
	onDelete?: (blockId: string) => void;
}

export default function DraggableBlock({
	block,
	isSelected,
	onSelect,
	onChange,
	onAddBelow,
	onDelete,
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
			{/* Block actions toolbar - visible when selected */}
			{isSelected && (
				<div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-white rounded-md shadow-md flex flex-col border border-gray-200">
					<Button
						variant="ghost"
						size="icon"
						className="p-2 hover:bg-gray-100"
						onClick={(e) => {
							e.stopPropagation();
							onAddBelow?.(block.id);
						}}
						title="Add element below"
					>
						<Plus size={16} />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="p-2 hover:bg-gray-100"
						onClick={(e) => {
							e.stopPropagation();
							// Edit functionality (placeholder)
						}}
						title="Edit block"
					>
						<Pencil size={16} />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="p-2 hover:bg-gray-100"
						{...attributes}
						{...listeners}
						title="Drag to reorder"
					>
						<GripVertical size={16} />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="p-2 hover:bg-gray-100"
						onClick={(e) => {
							e.stopPropagation();
							// Copy functionality (placeholder)
						}}
						title="Duplicate block"
					>
						<Copy size={16} />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="p-2 hover:bg-gray-100 text-red-500 hover:text-red-700"
						onClick={(e) => {
							e.stopPropagation();
							onDelete?.(block.id);
						}}
						title="Delete block"
					>
						<Trash2 size={16} />
					</Button>
				</div>
			)}

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
