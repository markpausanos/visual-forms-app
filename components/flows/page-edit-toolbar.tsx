'use client';

import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Page } from '../blocks/componentMap';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { blockToolbars } from './toolbar-components/block-toolbars';
import { AnyBlock } from '@/lib/types/block';
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
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { arrayMove } from '@dnd-kit/sortable';
import { Input } from '../ui/input';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

declare global {
	interface Window {
		tiptapEditors?: Record<string, Editor>;
	}
}

interface Props {
	pages: Page[];
	setPages: React.Dispatch<React.SetStateAction<Page[]>>;
	activePage: number;
	setActivePage: (index: number) => void;
	selectedBlock?: {
		id: string;
		type: string;
	} | null;
	onUpdateBlock?: (
		id: string,
		updatedProps: Partial<AnyBlock['props']>
	) => void;
	openImageSelector?: (blockId: string) => void;
}

export default function PageEditToolbar({
	pages,
	setPages,
	activePage,
	setActivePage,
	selectedBlock,
	onUpdateBlock,
	openImageSelector,
}: Props) {
	const [activeTab, setActiveTab] = useState<string>('pages');
	const page = pages[activePage];
	const currentBlock = selectedBlock
		? findBlockInPage(page?.blocks || [], selectedBlock.id)
		: undefined;
	const [activePageItem, setActivePageItem] = useState<Page | null>(null);

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

	useEffect(() => {
		// For debugging
		console.log('Selected block in toolbar:', selectedBlock);

		if (selectedBlock) {
			setActiveTab('edit');
		} else {
			setActiveTab('pages');
		}
	}, [selectedBlock]);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activePage = pages.find((page) => page.id === active.id);
		if (activePage) {
			setActivePageItem(activePage);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActivePageItem(null);

		if (over && active.id !== over.id) {
			const oldIndex = pages.findIndex((page) => page.id === active.id);
			const newIndex = pages.findIndex((page) => page.id === over.id);

			const reorderedPages = arrayMove(pages, oldIndex, newIndex);

			if (oldIndex === activePage) {
				setActivePage(newIndex);
			}

			setPages(reorderedPages);
		}
	};

	const handleAddPage = () => {
		setPages([...pages, { id: uuidv4(), name: 'Untitled', blocks: [] }]);
		setActivePage(pages.length);
	};

	const handleDeletePage = (pageId: string) => {
		if (pages.length <= 1) {
			toast.error("You can't delete the only page");
			return;
		}

		const newPages = pages.filter((page) => page.id !== pageId);

		if (activePage >= newPages.length) {
			setActivePage(newPages.length - 1);
		} else if (pages[activePage].id === pageId) {
			setActivePage(Math.max(0, activePage - 1));
		}

		setPages(newPages);
	};

	const handleUpdatePageName = (pageId: string, newName: string) => {
		setPages(
			pages.map((page) => {
				if (page.id === pageId) {
					return { ...page, name: newName };
				}
				return page;
			})
		);
	};

	return (
		<div className="w-[280px] border-l border-gray-200 bg-white overflow-auto">
			<div className="p-4 border-b border-gray-200">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="w-full">
						<TabsTrigger
							value="edit"
							className="flex-1"
							disabled={!selectedBlock}
						>
							Edit
						</TabsTrigger>
						<TabsTrigger value="pages" className="flex-1">
							Pages
						</TabsTrigger>
					</TabsList>

					<TabsContent value="edit">
						{selectedBlock && currentBlock
							? (() => {
									const Toolbar = blockToolbars[selectedBlock.type];
									return Toolbar ? (
										<Toolbar
											block={currentBlock}
											onChange={(id, updatedProps) =>
												onUpdateBlock?.(id, updatedProps)
											}
											openImageSelector={openImageSelector}
										/>
									) : (
										<p className="p-4 text-sm text-muted">
											No editor for &quot;{selectedBlock.type}&quot; yet.
										</p>
									);
							  })()
							: null}
					</TabsContent>

					<TabsContent value="pages">
						<div className="mt-4 space-y-2">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={pages.map((page) => page.id)}
									strategy={verticalListSortingStrategy}
								>
									{pages.map((page, idx) => (
										<DraggablePageCard
											key={page.id}
											page={page}
											idx={idx}
											isActive={activePage === idx}
											onClick={() => setActivePage(idx)}
											onDelete={handleDeletePage}
											onUpdateName={handleUpdatePageName}
										/>
									))}
								</SortableContext>

								{/* Drag overlay for better visual feedback */}
								<DragOverlay className="draggable-page-overlay">
									{activePageItem ? (
										<div className="opacity-80 border border-primary rounded-md p-2 bg-white shadow-lg">
											<div className="text-sm font-medium">
												{activePageItem.name}
											</div>
										</div>
									) : null}
								</DragOverlay>
							</DndContext>

							<Button
								variant="outline"
								className="w-full mt-4 text-sm flex items-center justify-center gap-2"
								onClick={handleAddPage}
							>
								<Plus size={16} />
								Add Page
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

type DraggablePageCardProps = {
	page: Page;
	idx: number;
	isActive: boolean;
	onClick: () => void;
	onDelete?: (pageId: string) => void;
	onUpdateName?: (pageId: string, newName: string) => void;
};

function DraggablePageCard({
	page,
	idx,
	isActive,
	onClick,
	onDelete,
	onUpdateName,
}: DraggablePageCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [pageName, setPageName] = useState(page.name || `Page ${idx + 1}`);
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: page.id,
		animateLayoutChanges: () => false,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// Focus input when entering edit mode
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	// Handle saving the page name on blur or Enter key
	const handleSaveName = () => {
		setIsEditing(false);
		if (pageName.trim() === '') {
			setPageName(page.name || `Page ${idx + 1}`);
			return;
		}

		if (pageName !== page.name) {
			onUpdateName?.(page.id, pageName);
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			data-dragging={isDragging}
			className={cn(
				'mb-3 p-3 rounded-lg cursor-pointer flex flex-row items-center justify-between transition-all',
				isDragging ? 'z-10 opacity-50' : 'opacity-100',
				isActive ? 'bg-muted' : 'border-transparent',
				'hover:border-gray-200'
			)}
			onClick={(e) => {
				if (!isEditing) {
					e.stopPropagation();
					onClick();
				}
			}}
		>
			{isEditing ? (
				<Input
					ref={inputRef}
					value={pageName}
					onChange={(e) => setPageName(e.target.value)}
					onBlur={handleSaveName}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSaveName();
						} else if (e.key === 'Escape') {
							setIsEditing(false);
							setPageName(page.name || `Page ${idx + 1}`);
						}
						e.stopPropagation();
					}}
					className="text-sm w-full mr-6"
					onClick={(e) => e.stopPropagation()}
				/>
			) : (
				<div
					className="text-sm font-medium pr-6"
					onDoubleClick={(e) => {
						e.stopPropagation();
						setIsEditing(true);
					}}
				>
					{page.name || `Page ${idx + 1}`}
				</div>
			)}

			<div className="flex flex-row items-center gap-2">
				{/* Drag handle */}
				<div
					className="text-gray-400 cursor-grab hover:text-gray-600"
					{...attributes}
					{...listeners}
				>
					<GripVertical size={16} />
				</div>

				{/* Delete button */}
				<div className="text-destructive">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={(e) => {
							e.stopPropagation();
							if (
								onDelete &&
								window.confirm(`Are you sure you want to delete "${page.name}"`)
							) {
								onDelete(page.id);
							}
						}}
					>
						<Trash2 size={16} />
					</Button>
				</div>
			</div>
		</div>
	);
}

// Find the current block based on the selected block ID, looking in all blocks including children
const findBlockInPage = (
	blocks: AnyBlock[],
	blockId: string
): AnyBlock | undefined => {
	// First search in top-level blocks
	let foundBlock = blocks.find((b) => b.id === blockId);
	if (foundBlock) return foundBlock;

	// Then search in nested blocks (Layout, Column, ColumnWrapper)
	for (const block of blocks) {
		// Check if block has children property and it's an array
		if (Array.isArray((block as any).children)) {
			// First check direct children
			foundBlock = (block as any).children.find(
				(child: AnyBlock) => child.id === blockId
			);
			if (foundBlock) return foundBlock;

			// Then recursively check grandchildren
			for (const child of (block as any).children) {
				if (Array.isArray((child as any).children)) {
					// Check in column blocks and column wrapper blocks
					foundBlock = (child as any).children.find(
						(grandchild: AnyBlock) => grandchild.id === blockId
					);
					if (foundBlock) return foundBlock;

					// One more level deeper for complex nesting (e.g., layout > column-wrapper > column > block)
					for (const grandchild of (child as any).children || []) {
						if (Array.isArray((grandchild as any).children)) {
							foundBlock = (grandchild as any).children.find(
								(greatGrandchild: AnyBlock) => greatGrandchild.id === blockId
							);
							if (foundBlock) return foundBlock;
						}
					}
				}
			}
		}
	}

	return undefined;
};
