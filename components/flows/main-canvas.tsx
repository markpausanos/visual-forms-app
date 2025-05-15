'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Page } from '../blocks/componentMap';
import PreviewModeToggle from './preview-mode-toggle';
import { useState } from 'react';
import {
	DndContext,
	closestCenter,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableBlock from './draggable-block';
import { reorderBlocks } from '@/lib/dnd-utils';
import { AnyBlock } from '@/lib/types/block';

interface MainCanvasProps {
	page: Page | null;
	pages: Page[] | null;
	setPages: (pages: Page[]) => void;
	activePageIndex: number;
	setActivePageIndex: (idx: number) => void;
	previewMode: 'desktop' | 'mobile';
	onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
	onSelectBlock?: (block: { id: string; type: string } | null) => void;
	onAddElementBelow?: (blockId: string) => void;
	onDelete?: (blockId: string) => void;
}

export default function MainCanvas({
	page,
	pages,
	setPages,
	activePageIndex,
	// We're not using setActivePageIndex, but keeping it in props
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setActivePageIndex,
	previewMode,
	onPreviewModeChange,
	onSelectBlock,
	onAddElementBelow,
	onDelete,
}: MainCanvasProps) {
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const [activeBlock, setActiveBlock] = useState<AnyBlock | null>(null);

	// Configure sensors for drag detection
	const sensors = useSensors(
		useSensor(MouseSensor, {
			// Require the mouse to move by 10px before activating
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(TouchSensor, {
			// Press delay of 250ms, with 5px tolerance
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		})
	);

	if (!pages) {
		return (
			<div className="flex-1 p-8 flex justify-center overflow-hidden">
				<div className="space-y-4 w-full max-w-3xl">
					<Skeleton className="h-10 rounded" />
					<Skeleton className="h-10 rounded" />
					<Skeleton className="h-64 rounded" />
				</div>
			</div>
		);
	}

	const handleBlockChange = (updated: AnyBlock) => {
		const newPages = [...pages];
		newPages[activePageIndex] = {
			...newPages[activePageIndex]!,
			blocks: newPages[activePageIndex]!.blocks.map((b) =>
				b.id === updated.id ? updated : b
			),
		};
		setPages(newPages);
	};

	const handleBlockSelect = (block: AnyBlock | null) => {
		setSelectedBlockId(block?.id || null);
		if (onSelectBlock) {
			onSelectBlock(block ? { id: block.id, type: block.type } : null);
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activeBlockData = page?.blocks.find(
			(block) => block.id === active.id
		);
		if (activeBlockData) {
			setActiveBlock(activeBlockData);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveBlock(null);

		if (over && active.id !== over.id) {
			const activePage = pages[activePageIndex];

			// Find the indices of the blocks
			const oldIndex = activePage.blocks.findIndex(
				(block) => block.id === active.id
			);
			const newIndex = activePage.blocks.findIndex(
				(block) => block.id === over.id
			);

			// Reorder blocks
			const reorderedPages = reorderBlocks(
				pages,
				activePageIndex,
				oldIndex,
				newIndex
			);

			// Update pages
			setPages(reorderedPages);
		}
	};

	return (
		<div className="relative flex-1 bg-muted flex flex-col h-full">
			{/* Main content area with scrolling */}
			<div className="flex-1 overflow-auto p-0 pt-10 pb-20">
				<div className="flex p-0 justify-center min-h-full">
					<div
						className={`w-full flex flex-col bg-white rounded-md shadow-sm p-0 overflow-visible transition-all duration-500 mb-4 ${
							previewMode === 'mobile' ? 'max-w-sm' : 'max-w-[960px]'
						}`}
						onClick={() => handleBlockSelect(null)}
					>
						{page?.blocks.length === 0 ? (
							<div className="p-8 text-center text-gray-400">
								Add blocks from the left sidebar to get started
							</div>
						) : (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={page?.blocks.map((block) => block.id) || []}
									strategy={verticalListSortingStrategy}
								>
									{page?.blocks.map((block) => (
										<DraggableBlock
											key={block.id}
											block={block}
											isSelected={selectedBlockId === block.id}
											onSelect={handleBlockSelect}
											onChange={handleBlockChange}
											onAddBelow={onAddElementBelow}
											onDelete={onDelete}
										/>
									))}
								</SortableContext>

								{/* Drag overlay for better visual feedback */}
								<DragOverlay className="sortable-drag-overlay">
									{activeBlock ? (
										<div className="opacity-80 border border-primary rounded-md p-2 bg-white shadow-lg">
											<div className="text-sm font-medium">
												{activeBlock.type} Block
											</div>
										</div>
									) : null}
								</DragOverlay>
							</DndContext>
						)}
					</div>
				</div>
			</div>

			{/* Fixed-position preview toggle */}
			<div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center bg-gradient-to-t from-muted to-transparent z-10">
				<PreviewModeToggle value={previewMode} onChange={onPreviewModeChange} />
			</div>
		</div>
	);
}
