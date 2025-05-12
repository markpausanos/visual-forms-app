import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Page } from '../blocks/componentMap';
import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { blockToolbars } from './toolbar-components/block-toolbars';
import { AnyBlock } from '@/lib/types/block';

declare global {
	interface Window {
		tiptapEditors?: Record<string, Editor>;
	}
}

interface Props {
	pages: Page[];
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
}

export default function PageEditToolbar({
	pages,
	activePage,
	setActivePage,
	selectedBlock,
	onUpdateBlock,
}: Props) {
	const [activeTab, setActiveTab] = useState<string>('pages');
	const page = pages[activePage];
	const currentBlock = page?.blocks.find((b) => b.id === selectedBlock?.id);

	useEffect(() => {
		if (selectedBlock) {
			setActiveTab('edit');
		} else {
			setActiveTab('pages');
		}
	}, [selectedBlock]);

	return (
		<div className="w-64 border-l border-gray-200 bg-white overflow-auto">
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
										/>
									) : (
										<p className="p-4 text-sm text-muted">
											No editor for “{selectedBlock.type}” yet.
										</p>
									);
							  })()
							: null}
					</TabsContent>

					<TabsContent value="pages">
						<div className="mt-4 space-y-2">
							{pages.map((page, idx) => (
								<PageCard
									key={page.id}
									title={page.name}
									isActive={activePage === idx}
									onClick={() => setActivePage(idx)}
								/>
							))}

							<Button
								variant="outline"
								className="w-full mt-4 text-sm flex items-center justify-center gap-2"
								onClick={() => {
									/* e.g. setPages([...pages, newPage]) */
								}}
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

type PageCardProps = {
	title: string;
	isActive: boolean;
	onClick: () => void;
};

function PageCard({ title, isActive, onClick }: PageCardProps) {
	return (
		<div
			className={`mb-3 p-3 rounded-lg cursor-pointer border ${
				isActive ? 'border-gray-300' : 'border-transparent'
			}`}
			onClick={onClick}
		>
			<div className="h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
				<div className="w-16 h-16 bg-gray-200 rounded-md"></div>
			</div>
			<div className="text-sm font-medium">{title}</div>
		</div>
	);
}
