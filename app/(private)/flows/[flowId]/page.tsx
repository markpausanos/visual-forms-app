/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getFlowById } from '@/actions/flows';
import AvatarDropdown from '@/components/avatar-dropdown';
import ElementToolbar from '@/components/flows/element-toolbar';
import MainCanvas from '@/components/flows/main-canvas';
import PageEditToolbar from '@/components/flows/page-edit-toolbar';
import { Button } from '@/components/ui/button';
import { Settings, Send, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
	const params = useParams<{ flowId: string }>();

	// const [activeTab, setActiveTab] = useState('funnel');
	const [activePage, setActivePage] = useState('start');
	const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
		'desktop'
	);
	const [json, setJson] = useState<any[] | null>(null);

	console.log(JSON.stringify(json));

	const page = json?.[0] ?? null;

	const updateFirstPage = (newPage: object | null) => {
		if (!json || !newPage) return;
		const updated = [newPage, ...json.slice(1)];
		setJson(updated);
	};

	useEffect(() => {
		const fetchFlow = async () => {
			const flow = await getFlowById(params.flowId);
			if (flow && Array.isArray(flow.saved_json)) {
				setJson(flow.saved_json);
			}
		};

		fetchFlow();
	}, []);

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="border-b border-muted bg-background py-4 px-4">
				<div className="flex items-center justify-between">
					<div>
						<Link href="/workspaces">
							<Button variant="link" className="text-sm space-x-2">
								<ArrowLeft size={16} />
								Back to Workspace
							</Button>
						</Link>
					</div>
					<div className="flex items-center space-x-3">
						<AvatarDropdown />
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
						<Button className="bg-black text-white hover:bg-gray-800 text-sm flex items-center gap-2 rounded-xl">
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
