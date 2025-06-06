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
import { toast } from 'sonner';
import { useDroppable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

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

	// Make the main canvas droppable
	const { setNodeRef: setCanvasNodeRef } = useDroppable({
		id: 'main-canvas',
		data: {
			type: 'Canvas',
			accepts: ['Text', 'Image', 'Layout', 'Column', 'ColumnWrapper'],
			isContainer: true,
		},
	});

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

	// Helper function to check if a block is a column wrapper
	const isColumnWrapper = (block: AnyBlock): boolean => {
		return block.type === 'ColumnWrapper';
	};

	// Helper function to check if a block is a column block
	const isColumnBlock = (block: AnyBlock): boolean => {
		return block.type === 'Column';
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveBlock(null);

		if (!over) return;

		// Get data attributes that might contain parent info
		const sourceParentId = (active.data?.current as any)?.parentBlockId;
		const destinationParentId = (over.data?.current as any)?.parentBlockId;

		console.log('Drag end:', {
			sourceId: active.id,
			sourceParent: sourceParentId,
			destinationId: over.id,
			destinationParent: destinationParentId,
		});

		if (active.id !== over.id) {
			const activePage = pages[activePageIndex];

			// CASE 1: Reordering within the same column
			if (
				sourceParentId &&
				destinationParentId &&
				sourceParentId === destinationParentId
			) {
				// Find the parent block (column)
				const parentBlock = findBlockById(activePage.blocks, sourceParentId);
				if (parentBlock && Array.isArray((parentBlock as any).children)) {
					// Find the indices of the blocks
					const oldIndex = (parentBlock as any).children.findIndex(
						(child: any) => child.id === active.id
					);
					const newIndex = (parentBlock as any).children.findIndex(
						(child: any) => child.id === over.id
					);

					if (oldIndex !== -1 && newIndex !== -1) {
						// Create a copy of the blocks array
						const updatedPages = [...pages];
						const updatedBlocks = structuredClone(activePage.blocks);

						// Find parent block in the copy
						const updatedParent = findBlockById(updatedBlocks, sourceParentId);
						if (
							updatedParent &&
							Array.isArray((updatedParent as any).children)
						) {
							// Reorder the children
							const children = [...(updatedParent as any).children];
							const [movedBlock] = children.splice(oldIndex, 1);
							children.splice(newIndex, 0, movedBlock);

							// Update the parent's children
							(updatedParent as any).children = children;

							// Update the pages
							updatedPages[activePageIndex] = {
								...activePage,
								blocks: updatedBlocks,
							};

							setPages(updatedPages);
							return;
						}
					}
				}
			}

			// CASE 2: Moving from a column to main canvas
			if (
				sourceParentId &&
				(!destinationParentId || over.id === 'main-canvas')
			) {
				// Get the block from the column
				const sourceBlock = getBlockFromLayout(
					activePage.blocks,
					sourceParentId,
					active.id as string
				);
				if (sourceBlock) {
					// Prevent Column blocks from being moved outside of ColumnWrapper
					if (isColumnBlock(sourceBlock)) {
						toast.error(
							'Column blocks can only be used inside a Column Wrapper'
						);
						return;
					}

					// Create new blocks array
					const updatedPages = [...pages];
					const updatedBlocks = structuredClone(activePage.blocks);

					// Remove the block from its parent
					const updatedParent = findBlockById(updatedBlocks, sourceParentId);
					if (updatedParent && Array.isArray((updatedParent as any).children)) {
						(updatedParent as any).children = (
							updatedParent as any
						).children.filter((child: any) => child.id !== active.id);
					}

					// Find where to insert in main canvas
					// If we're dragging to the main-canvas itself or can't find a specific target,
					// add to the end of the main canvas
					if (over.id === 'main-canvas') {
						// Add to the end of canvas
						updatedBlocks.push(sourceBlock);
					} else {
						// Try to insert after the specific block
						const overIndex = updatedBlocks.findIndex(
							(block) => block.id === over.id
						);

						if (overIndex !== -1) {
							updatedBlocks.splice(overIndex + 1, 0, sourceBlock);
						} else {
							// Fallback - add to the end
							updatedBlocks.push(sourceBlock);
						}
					}

					// Update the pages
					updatedPages[activePageIndex] = {
						...activePage,
						blocks: updatedBlocks,
					};

					setPages(updatedPages);
					return;
				}
			}

			// CASE 3: Moving from main canvas to column
			if (!sourceParentId && destinationParentId) {
				// Get the block from main canvas
				const sourceBlock = activePage.blocks.find(
					(block) => block.id === active.id
				);

				if (sourceBlock) {
					// Find the destination column
					const destinationParent = findBlockById(
						activePage.blocks,
						destinationParentId
					);
					if (
						destinationParent &&
						Array.isArray((destinationParent as any).children)
					) {
						// Create new blocks array
						const updatedPages = [...pages];
						const updatedBlocks = structuredClone(activePage.blocks);

						// Remove the block from main canvas
						const sourceIndex = updatedBlocks.findIndex(
							(block) => block.id === active.id
						);
						if (sourceIndex !== -1) {
							updatedBlocks.splice(sourceIndex, 1);
						}

						// Find the destination column in the updated blocks
						const updatedDestination = findBlockById(
							updatedBlocks,
							destinationParentId
						);
						if (
							updatedDestination &&
							Array.isArray((updatedDestination as any).children)
						) {
							// Add the block to the column
							(updatedDestination as any).children.push(sourceBlock);
						}

						// Update the pages
						updatedPages[activePageIndex] = {
							...activePage,
							blocks: updatedBlocks,
						};

						setPages(updatedPages);
						return;
					}
				}
			}

			// CASE 4: Moving between different columns
			if (
				sourceParentId &&
				destinationParentId &&
				sourceParentId !== destinationParentId
			) {
				// Get the block from source column
				const sourceBlock = getBlockFromLayout(
					activePage.blocks,
					sourceParentId,
					active.id as string
				);
				if (sourceBlock) {
					// Create new blocks array
					const updatedPages = [...pages];
					const updatedBlocks = structuredClone(activePage.blocks);

					// Remove the block from its parent
					const updatedSourceParent = findBlockById(
						updatedBlocks,
						sourceParentId
					);
					if (
						updatedSourceParent &&
						Array.isArray((updatedSourceParent as any).children)
					) {
						(updatedSourceParent as any).children = (
							updatedSourceParent as any
						).children.filter((child: any) => child.id !== active.id);
					}

					// Add the block to the destination column
					const updatedDestination = findBlockById(
						updatedBlocks,
						destinationParentId
					);
					if (
						updatedDestination &&
						Array.isArray((updatedDestination as any).children)
					) {
						// Find the position to insert at
						const overIndex = (updatedDestination as any).children.findIndex(
							(child: any) => child.id === over.id
						);

						if (overIndex !== -1) {
							// Insert after the over block
							(updatedDestination as any).children.splice(
								overIndex + 1,
								0,
								sourceBlock
							);
						} else {
							// Add to the end
							(updatedDestination as any).children.push(sourceBlock);
						}
					}

					// Update the pages
					updatedPages[activePageIndex] = {
						...activePage,
						blocks: updatedBlocks,
					};

					setPages(updatedPages);
					return;
				}
			}

			// NEW CASE: Moving from main canvas or another container directly to a Column Wrapper
			const overDestinationType = (over.data?.current as any)?.type;
			if (overDestinationType === 'ColumnWrapper') {
				// Get the block being dragged (either from main canvas or another container)
				const sourceBlock = sourceParentId
					? getBlockFromLayout(
							activePage.blocks,
							sourceParentId,
							active.id as string
					  )
					: activePage.blocks.find((block) => block.id === active.id);

				if (sourceBlock) {
					// Don't allow column wrapper to be dropped inside a column wrapper
					if (isColumnWrapper(sourceBlock)) {
						toast.error(
							'Cannot drop a Column Wrapper inside another Column Wrapper'
						);
						return;
					}

					// Create new blocks array
					const updatedPages = [...pages];
					const updatedBlocks = structuredClone(activePage.blocks);

					// Find the column wrapper we're dropping into
					const columnWrapper = findBlockById(updatedBlocks, over.id as string);
					if (columnWrapper && columnWrapper.type === 'ColumnWrapper') {
						// If the max columns is reached, show error
						const MAX_COLUMNS = 4;
						if (columnWrapper.children.length >= MAX_COLUMNS) {
							toast.error(`Maximum of ${MAX_COLUMNS} columns reached`);
							return;
						}

						// Create a new column to wrap the block
						const newColumn = {
							id: uuidv4(),
							type: 'Column' as const,
							props: {
								backgroundColor: 'transparent',
								padding: 16,
							},
							children: [sourceBlock],
						};

						// Remove the block from its source
						if (sourceParentId) {
							// Remove from previous container
							const sourceParent = findBlockById(updatedBlocks, sourceParentId);
							if (
								sourceParent &&
								Array.isArray((sourceParent as any).children)
							) {
								(sourceParent as any).children = (
									sourceParent as any
								).children.filter((child: any) => child.id !== active.id);
							}
						} else {
							// Remove from main canvas
							const blockIndex = updatedBlocks.findIndex(
								(block) => block.id === active.id
							);
							if (blockIndex !== -1) {
								updatedBlocks.splice(blockIndex, 1);
							}
						}

						// Add the new column to the column wrapper
						columnWrapper.children.push(newColumn);

						// Update the pages
						updatedPages[activePageIndex] = {
							...activePage,
							blocks: updatedBlocks,
						};

						setPages(updatedPages);
						return;
					}
				}
			}

			// CASE 5: Standard reordering for top-level blocks (original logic)
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

	// Helper function to handle dropping a block into a column
	const handleDropIntoColumn = (
		active: any,
		over: any,
		parentBlockId: string | undefined,
		activePage: Page,
		columnBlock: any
	) => {
		// Get the source block
		const sourceBlock = parentBlockId
			? getBlockFromLayout(
					activePage.blocks,
					parentBlockId,
					active.id as string
			  )
			: activePage.blocks.find((block) => block.id === active.id);

		if (!sourceBlock) return;

		// Don't allow column wrapper to be dropped inside a column
		if (isColumnWrapper(sourceBlock)) {
			toast.error(
				'Column Wrapper blocks cannot be placed inside Column blocks'
			);
			return;
		}

		// Create a new pages array
		const updatedPages = [...pages];
		const updatedBlocks = [...activePage.blocks];

		// If the block is coming from another layout or column, remove it from there
		if (parentBlockId) {
			// Find parent block (might be layout or column)
			const parentBlock = findBlockById(updatedBlocks, parentBlockId);
			if (parentBlock && Array.isArray((parentBlock as any).children)) {
				(parentBlock as any).children = (parentBlock as any).children.filter(
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

		// Add the block to the column's children
		columnBlock.children = columnBlock.children || [];
		columnBlock.children = [...columnBlock.children, sourceBlock];

		// Update the page with the new blocks
		updatedPages[activePageIndex] = {
			...activePage,
			blocks: updatedBlocks,
		};

		setPages(updatedPages);
	};

	// Helper function to find a block by ID anywhere in the block tree
	const findBlockById = (
		blocks: AnyBlock[],
		blockId: string
	): AnyBlock | null => {
		// First check top level blocks
		const topLevelBlock = blocks.find((block) => block.id === blockId);
		if (topLevelBlock) return topLevelBlock;

		// Then check nested blocks
		for (const block of blocks) {
			if ((block as any).children) {
				for (const child of (block as any).children) {
					if (child.id === blockId) return child;

					// Check one level deeper for column wrappers
					if (
						child.type === 'ColumnWrapper' &&
						Array.isArray((child as any).children)
					) {
						for (const columnChild of (child as any).children) {
							if (columnChild.id === blockId) return columnChild;
						}
					}
				}
			}
		}

		return null;
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
						ref={setCanvasNodeRef}
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
											previewMode={previewMode}
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
