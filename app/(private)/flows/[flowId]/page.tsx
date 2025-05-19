'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getFlowById, updateFlow } from '@/actions/flows';
import { uploadJsonToStorage } from '@/actions/upload-storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Send, Share2, HomeIcon } from 'lucide-react';

import MainToolbar from '@/components/flows/main-toolbar';
import MainCanvas from '@/components/flows/main-canvas';
import PageEditToolbar from '@/components/flows/page-edit-toolbar';
import { Page as FlowPage } from '@/components/blocks/componentMap';
import { blockMapper } from '@/lib/utils/block-utils';
import { AnyBlock, LayoutBlock } from '@/lib/types/block';

export default function Page() {
	const { flowId } = useParams<{ flowId: string }>();
	const router = useRouter();

	const [pages, setPages] = useState<FlowPage[]>([]);
	const [activePageIndex, setActivePageIndex] = useState(0);
	const [title, setTitle] = useState('Untitled');
	const [isFetching, setIsFetching] = useState(true);
	const [isPublishing, setIsPublishing] = useState(false);
	const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
		'desktop'
	);

	const [selectedBlock, setSelectedBlock] = useState<{
		id: string;
		type: string;
	} | null>(null);

	const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(
		null
	);

	// New state for controlling element toolbar and image view
	const [showElementToolbar, setShowElementToolbar] = useState(false);
	const [showImageToolbar, setShowImageToolbar] = useState(false);

	// Add a new state to track which block we're replacing
	const [replacingBlockId, setReplacingBlockId] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setIsFetching(true);

			try {
				const flow = await getFlowById(flowId);

				if (!flow) {
					throw new Error('Flow not found');
				}

				const pagesWithJson: FlowPage[] = (flow.saved_json as FlowPage[]).map(
					(page) => ({
						id: page.id,
						name: page.name,
						blocks: page.blocks.map((block) => blockMapper(block)),
					})
				);

				setTitle(flow.title || 'Untitled');
				setPages(pagesWithJson);
			} catch (error) {
				console.error('Error fetching flow:', error);
				toast.error('Failed to load flow');
			} finally {
				setIsFetching(false);
			}
		})();
	}, [flowId]);

	const handlePublish = async () => {
		if (isPublishing || !pages) return;
		setIsPublishing(true);

		try {
			const fullPath = await uploadJsonToStorage(pages, flowId);
			if (!fullPath) throw new Error('upload failed');

			const updated = await updateFlow(flowId, {
				saved_json: pages,
				published_url: fullPath,
			});
			if (!updated) throw new Error('update failed');

			toast.success('Flow published successfully');
			router.push(`/${updated.published_url}`);
		} catch {
			toast.error('Failed to publish flow');
		} finally {
			setIsPublishing(false);
		}
	};

	const handleUpdateBlock = (
		blockId: string,
		updatedProps: Partial<AnyBlock['props']>
	) => {
		setPages((current) =>
			current.map((page, idx) => {
				if (idx !== activePageIndex) return page;
				return {
					...page,
					blocks: page.blocks.map((block) => {
						if (block.id !== blockId) return block;

						return {
							...block,
							props: {
								...block.props,
								...updatedProps,
							},
						} as AnyBlock;
					}),
				};
			})
		);
	};

	const handleAddElementWithPosition = (
		block: AnyBlock,
		afterBlockId: string | null,
		layoutBlockId: string | null
	) => {
		setPages((prevPages) => {
			const next = [...prevPages];
			const activePage = next[activePageIndex];

			// If we have a layout block ID, add the block to that layout's children
			if (layoutBlockId) {
				next[activePageIndex] = {
					...activePage,
					blocks: activePage.blocks.map((b) => {
						if (b.id !== layoutBlockId) return b;
						if (b.type !== 'Layout') return b;

						// Add block to layout's children
						return {
							...b,
							children: [...(b.children || []), block],
						} as LayoutBlock;
					}),
				};
				return next;
			}

			// Handle normal block insertion
			if (!afterBlockId) {
				next[activePageIndex] = {
					...activePage,
					blocks: [...activePage.blocks, block],
				};
				return next;
			}

			const insertIndex = activePage.blocks.findIndex(
				(b) => b.id === afterBlockId
			);

			if (insertIndex === -1) {
				next[activePageIndex] = {
					...activePage,
					blocks: [...activePage.blocks, block],
				};
			} else {
				const newBlocks = [...activePage.blocks];
				newBlocks.splice(insertIndex + 1, 0, block);

				next[activePageIndex] = {
					...activePage,
					blocks: newBlocks,
				};
			}

			return next;
		});
	};

	const handleAddElementAfter = (
		block: AnyBlock,
		afterBlockId: string,
		layoutBlockId: string | null
	) => {
		handleAddElementWithPosition(block, afterBlockId, layoutBlockId);
		setInsertAfterBlockId(null);
	};

	const handleOpenImageSelector = (blockId?: string) => {
		if (blockId) {
			setReplacingBlockId(blockId);
		}
		setShowElementToolbar(true);
		setShowImageToolbar(true);
	};

	const activePage = pages?.[activePageIndex] ?? null;

	return (
		<div className="flex flex-col h-screen bg-background">
			{/* header */}
			<header className="border-b border-muted bg-background py-4 px-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center flex-row gap-4">
						<Link href="/workspaces">
							<Button variant="link" className="text-sm space-x-2">
								<HomeIcon size={16} />
							</Button>
						</Link>
						<Input
							disabled={isFetching}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Untitled"
							className="border-b"
							inputClassName="bg-background border-none border focus:border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
						/>
					</div>
					<div className="flex items-center space-x-3">
						<Button variant="outline" size="icon" className="rounded-full">
							<Settings size={20} />
						</Button>
						<Button
							variant="outline"
							className="text-sm flex items-center gap-2 rounded-xl"
						>
							<Share2 size={16} />
							Share
						</Button>
						<Button
							disabled={isPublishing}
							onClick={handlePublish}
							className="bg-black text-white hover:bg-gray-800 text-sm flex items-center gap-2 rounded-xl"
						>
							<Send size={16} />
							Publish
						</Button>
					</div>
				</div>
			</header>

			{/* body */}
			<div className="flex flex-1 overflow-hidden">
				<MainToolbar
					onAddElement={(block: AnyBlock) => {
						handleAddElementWithPosition(block, null, null);
					}}
					onAddElementAfter={(block: AnyBlock, afterBlockId: string) => {
						handleAddElementAfter(block, afterBlockId, null);
					}}
					onUpdateBlock={handleUpdateBlock}
					insertAfterBlockId={insertAfterBlockId}
					replacingBlockId={replacingBlockId}
					showElementToolbar={showElementToolbar}
					setShowElementToolbar={setShowElementToolbar}
					showImageToolbar={showImageToolbar}
					setShowImageToolbar={setShowImageToolbar}
				/>

				<MainCanvas
					page={activePage}
					pages={pages}
					setPages={setPages}
					activePageIndex={activePageIndex}
					setActivePageIndex={setActivePageIndex}
					previewMode={previewMode}
					onPreviewModeChange={setPreviewMode}
					onSelectBlock={setSelectedBlock}
					onAddElementBelow={(blockId) => {
						setInsertAfterBlockId(blockId);
					}}
					onDelete={(blockId) => {
						setPages((current) =>
							current.map((page, idx) => {
								if (idx !== activePageIndex) return page;
								return {
									...page,
									blocks: page.blocks.filter((block) => block.id !== blockId),
								};
							})
						);
						if (selectedBlock?.id === blockId) {
							setSelectedBlock(null);
						}
					}}
				/>

				<PageEditToolbar
					pages={pages ?? []}
					setPages={setPages}
					activePage={activePageIndex}
					setActivePage={setActivePageIndex}
					selectedBlock={selectedBlock}
					onUpdateBlock={handleUpdateBlock}
					openImageSelector={handleOpenImageSelector}
				/>
			</div>
		</div>
	);
}
