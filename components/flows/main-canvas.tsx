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
			// Create a proper block object with id and type for the toolbar
			onSelectBlock(block ? { id: block.id, type: block.type } : null);

			// For debugging
			console.log(
				'Selected block:',
				block ? { id: block.id, type: block.type } : null
			);
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

		if (!over) return;

		// Get data attribute that might contain parent info
		const parentBlockId = (active.data?.current as any)?.parentBlockId;

		if (active.id !== over.id) {
			const activePage = pages[activePageIndex];

			// Check if the over block is a layout block
			const overBlock = activePage.blocks.find((block) => block.id === over.id);
			if (overBlock && overBlock.type === 'Layout') {
				// We're dropping a block into a layout block
				const sourceBlock = parentBlockId
					? getBlockFromLayout(
							activePage.blocks,
							parentBlockId,
							active.id as string
					  )
					: activePage.blocks.find((block) => block.id === active.id);

				if (sourceBlock) {
					// Create a new pages array
					const updatedPages = [...pages];
					const updatedBlocks = [...activePage.blocks];

					// If the block is coming from another layout, remove it from there
					if (parentBlockId) {
						const parentBlock = updatedBlocks.find(
							(block) => block.id === parentBlockId
						) as any;
						if (parentBlock && parentBlock.children) {
							parentBlock.children = parentBlock.children.filter(
								(child: any) => child.id !== active.id
							);
						}
					} else {
						// Remove the block from main canvas
						const blockIndex = updatedBlocks.findIndex(
							(block) => block.id === active.id
						);
						if (blockIndex !== -1) {
							updatedBlocks.splice(blockIndex, 1);
						}
					}

					// Add the block to the layout's children
					const targetLayout = updatedBlocks.find(
						(block) => block.id === over.id
					) as any;
					if (targetLayout) {
						// Ensure children array is initialized
						targetLayout.children = targetLayout.children || [];

						// Ensure props is initialized
						targetLayout.props = targetLayout.props || {};

						// Add the block to the layout's children
						targetLayout.children = [...targetLayout.children, sourceBlock];

						// For debugging
						console.log('Added block to layout:', {
							layoutId: targetLayout.id,
							blockId: sourceBlock.id,
							childrenCount: targetLayout.children.length,
						});
					}

					// Update the page with the new blocks
					updatedPages[activePageIndex] = {
						...activePage,
						blocks: updatedBlocks,
					};

					setPages(updatedPages);
					return;
				}
			}

			// Check if the block is from a layout block
			if (parentBlockId) {
				// Find the parent layout block
				const parentLayoutBlock = activePage.blocks.find(
					(block) => block.id === parentBlockId
				) as any; // Cast to any for accessing children

				if (parentLayoutBlock && parentLayoutBlock.children) {
					// Find the block in the parent's children
					const blockIndex = parentLayoutBlock.children.findIndex(
						(child: any) => child.id === active.id
					);

					if (blockIndex !== -1) {
						// Get the block from parent's children
						const blockToMove = parentLayoutBlock.children[blockIndex];

						// Remove from parent
						const updatedChildren = [
							...parentLayoutBlock.children.slice(0, blockIndex),
							...parentLayoutBlock.children.slice(blockIndex + 1),
						];

						// Find where to insert in main canvas
						const overIndex = activePage.blocks.findIndex(
							(block) => block.id === over.id
						);

						// Update layout block without the moved child
						const updatedLayoutBlock = {
							...parentLayoutBlock,
							children: updatedChildren,
						};

						// Create new blocks array with the block moved to main canvas
						const newBlocks = [...activePage.blocks];
						// Replace the layout block with updated version
						const layoutBlockIndex = newBlocks.findIndex(
							(block) => block.id === parentBlockId
						);
						if (layoutBlockIndex !== -1) {
							newBlocks[layoutBlockIndex] = updatedLayoutBlock;
						}

						// Insert the moved block after the target
						newBlocks.splice(overIndex + 1, 0, blockToMove);

						// Update pages with the new blocks
						const updatedPages = [...pages];
						updatedPages[activePageIndex] = {
							...activePage,
							blocks: newBlocks,
						};

						setPages(updatedPages);
						return;
					}
				}
			}

			// Standard reordering for top-level blocks
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

	// Helper function to get a block from a layout
	const getBlockFromLayout = (
		blocks: AnyBlock[],
		layoutId: string,
		blockId: string
	): AnyBlock | null => {
		const layoutBlock = blocks.find((block) => block.id === layoutId) as any;
		if (layoutBlock && Array.isArray(layoutBlock.children)) {
			const foundBlock = layoutBlock.children.find(
				(child: any) => child.id === blockId
			);
			if (foundBlock) {
				return foundBlock;
			}
		}
		console.log('Block not found in layout:', { layoutId, blockId });
		return null;
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
											selectedBlockId={selectedBlockId}
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
