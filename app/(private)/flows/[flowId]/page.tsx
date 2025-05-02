/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getFlowById, updateFlow } from '@/actions/flows';
import { uploadJsonToStorage } from '@/actions/storage';
import ElementToolbar from '@/components/flows/element-toolbar';
import MainCanvas from '@/components/flows/main-canvas';
import PageEditToolbar from '@/components/flows/page-edit-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Send, Share2, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
	const params = useParams<{ flowId: string }>();
	const router = useRouter();

	// const [activeTab, setActiveTab] = useState('funnel');
	const [activePage, setActivePage] = useState('start');
	const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
		'desktop'
	);
	const [isFetching, setIsFetching] = useState(true);

	const [title, setTitle] = useState('Untitled');
	const [json, setJson] = useState<any[] | null>(null);

	const [isPublishing, setIsPublishing] = useState(false);

	const page = json?.[0] ?? null;

	const updateFirstPage = (newPage: object | null) => {
		if (!json || !newPage) return;
		const updated = [newPage, ...json.slice(1)];
		setJson(updated);
	};

	const handlePublish = async () => {
		if (isPublishing) return;
		setIsPublishing(true);
		if (!json) return;

		try {
			const flowId = params.flowId;
			const fullPath = await uploadJsonToStorage(json, flowId);

			if (!fullPath) {
				toast.error('Failed to upload JSON');
				return;
			}

			const updatedFlow = await updateFlow(flowId, {
				saved_json: json,
				published_url: fullPath,
			});

			if (!updatedFlow) {
				toast.error('Failed to update flow');
				return;
			}

			toast.success('Flow published successfully');

			router.push(`/${updatedFlow.published_url}`);
		} catch {
			toast.error('Failed to publish flow');
		} finally {
			setIsPublishing(false);
		}
	};

	useEffect(() => {
		setIsFetching(true);
		const fetchFlow = async () => {
			const flow = await getFlowById(params.flowId);
			if (!flow) {
				toast.error('Failed to fetch flow');
				return;
			}

			setTitle(flow.title);
			if (Array.isArray(flow.saved_json)) {
				setJson(flow.saved_json);
			}
			setIsFetching(false);
		};

		fetchFlow();
	}, []);

	return (
		<div className="flex flex-col h-screen bg-background">
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

			<div className="flex flex-1 overflow-hidden">
				<ElementToolbar />
				<MainCanvas
					json={page}
					setJson={updateFirstPage}
					previewMode={previewMode}
					onPreviewModeChange={(mode) => setPreviewMode(mode)}
				/>
				<PageEditToolbar
					activePage={activePage}
					setActivePage={setActivePage}
				/>
			</div>
		</div>
	);
}
