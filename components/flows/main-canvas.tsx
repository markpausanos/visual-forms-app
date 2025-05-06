'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Block, componentMap, Page } from '../blocks/componentMap';
import PreviewModeToggle from './preview-mode-toggle';
import { useState } from 'react';

interface MainCanvasProps {
	page: Page | null;
	pages: Page[] | null;
	setPages: (pages: Page[]) => void;
	activePageIndex: number;
	setActivePageIndex: (idx: number) => void;
	previewMode: 'desktop' | 'mobile';
	onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
	onSelectBlock?: (block: { id: string; type: string } | null) => void;
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
}: MainCanvasProps) {
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	if (!pages) {
		return (
			<div className="flex-1 p-8 flex justify-center">
				<div className="space-y-4 w-full max-w-3xl">
					<Skeleton className="h-10 rounded" />
					<Skeleton className="h-10 rounded" />
					<Skeleton className="h-64 rounded" />
				</div>
			</div>
		);
	}

	const handleBlockChange = (updated: Block) => {
		const newPages = [...pages];
		newPages[activePageIndex] = {
			...newPages[activePageIndex]!,
			blocks: newPages[activePageIndex]!.blocks.map((b) =>
				b.id === updated.id ? updated : b
			),
		};
		setPages(newPages);
	};

	const handleBlockSelect = (block: Block | null) => {
		setSelectedBlockId(block?.id || null);
		if (onSelectBlock) {
			onSelectBlock(block ? { id: block.id, type: block.type } : null);
		}
	};

	return (
		<div className="relative flex-1 bg-muted overflow-auto p-8 flex justify-center">
			<div
				className={`w-full flex flex-col bg-white rounded-md shadow-sm p-5 transition-all duration-500 ${
					previewMode === 'mobile' ? 'max-w-sm' : 'max-w-3xl'
				}`}
				onClick={() => handleBlockSelect(null)}
			>
				{page?.blocks.map((block) => {
					const BlockComp = componentMap[block.type];
					if (!BlockComp) {
						return (
							<div key={block.id} className="text-red-500">
								Unsupported block: {block.type}
							</div>
						);
					}
					return (
						<div
							key={block.id}
							className={`block-wrapper p-1 ${selectedBlockId === block.id ? '' : ''}`}
							onClick={(e) => {
								e.stopPropagation();
								handleBlockSelect(block);
							}}
						>
							<BlockComp block={block} onChange={handleBlockChange} />
						</div>
					);
				})}

				{/* "Add section" button */}
				<div
					className="w-full h-64 flex items-center justify-center border-2 border-muted-foreground/20 rounded-md mt-4"
					onClick={(e) => e.stopPropagation()}
				>
					<Button
						variant="ghost"
						className="flex flex-col items-center gap-2 hover:bg-white"
						onClick={() => {
							/* insert a new default Text block into page.blocks */
						}}
					>
						<Plus size={24} className="text-gray-400" />
						<span className="text-muted-foreground">Add section</span>
					</Button>
				</div>
			</div>

			{/* preview toggle */}
			<div className="absolute bottom-0 p-8">
				<PreviewModeToggle value={previewMode} onChange={onPreviewModeChange} />
			</div>
		</div>
	);
}
