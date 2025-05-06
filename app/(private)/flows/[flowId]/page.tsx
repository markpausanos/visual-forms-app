'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getFlowById, updateFlow } from '@/actions/flows';
import { uploadJsonToStorage } from '@/actions/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Send, Share2, HomeIcon } from 'lucide-react';

import ElementToolbar from '@/components/flows/element-toolbar';
import MainCanvas from '@/components/flows/main-canvas';
import PageEditToolbar from '@/components/flows/page-edit-toolbar';
import { Page as FlowPage } from '@/components/blocks/componentMap';
import { htmlToJSON } from '@/lib/tiptapHelpers';
import { HtmlOnlyPage } from '@/lib/types/block';

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

	console.log(pages);

	useEffect(() => {
		(async () => {
			setIsFetching(true);

			try {
				const flow = await getFlowById(flowId);

				if (!flow) {
					throw new Error('Flow not found');
				}

				const pagesWithJson: FlowPage[] = (
					flow.saved_json as HtmlOnlyPage[]
				).map((page) => ({
					id: page.id,
					name: page.name,
					blocks: page.blocks.map((block) => ({
						id: block.id,
						type: block.type,
						props: {
							html: block.props.html,
							json: htmlToJSON(block.props.html),
						},
					})),
				}));

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
		newProps: Record<string, unknown>
	) => {
		if (!pages) return;
		setPages((current) =>
			current.map((page, idx) => {
				if (idx !== activePageIndex) return page;
				return {
					...page,
					blocks: page.blocks.map((block) =>
						block.id === blockId
							? { ...block, props: { ...block.props, ...newProps } }
							: block
					),
				};
			})
		);
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
							className="p-0
							border-0 border-b border-muted bg-transparent rounded-none shadow-none focus-visible:ring-0 focus:border-primary"
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
				<ElementToolbar />

				<MainCanvas
					page={activePage}
					pages={pages}
					setPages={setPages}
					activePageIndex={activePageIndex}
					setActivePageIndex={setActivePageIndex}
					previewMode={previewMode}
					onPreviewModeChange={setPreviewMode}
					onSelectBlock={setSelectedBlock}
				/>

				<PageEditToolbar
					pages={pages ?? []}
					activePage={activePageIndex}
					setActivePage={setActivePageIndex}
					selectedBlock={selectedBlock}
					onUpdateBlock={handleUpdateBlock}
				/>
			</div>
		</div>
	);
}
