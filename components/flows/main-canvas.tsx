/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import PreviewModeToggle from './preview-mode-toggle';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

interface Props {
	json: any | null;
	setJson: (json: object | null) => void;
	previewMode: 'mobile' | 'desktop';
	onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
}

export default function MainCanvas({
	json,
	setJson,
	previewMode = 'desktop',
	onPreviewModeChange,
}: Props) {
	const handleTextChange = (blockId: string, newText: string) => {
		if (!json) return;

		const updated = {
			...json,
			blocks: json.blocks.map((block: any) =>
				block.id === blockId && block.type === 'Text'
					? {
							...block,
							props: {
								...block.props,
								text: newText,
							},
						}
					: block
			),
		};

		setJson(updated);
	};

	return (
		<div className="relative flex-1 bg-muted overflow-auto p-8 flex justify-center">
			<div
				className={`w-full flex flex-col items-center bg-white rounded-md shadow-sm p-5 transition-all duration-500 
			${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-3xl'}`}
			>
				{json === null ? (
					<div className="w-full space-y-4">
						{Array.from({ length: 2 }).map((_, i) => (
							<Skeleton key={i} className="w-full h-10 rounded" />
						))}
						<Skeleton className="w-full h-64 rounded" />
					</div>
				) : (
					<>
						{json.blocks
							?.filter((block: any) => block.type === 'Text')
							.map((block: any) => (
								<Input
									key={block.id}
									value={block.props.text}
									onChange={(e) => handleTextChange(block.id, e.target.value)}
									className="w-full mb-4 px-3 py-2 rounded text-sm bg-white placeholder:bg-white"
								/>
							))}

						<div className="w-full h-64 flex items-center justify-center border-2 border-muted-foreground/20 rounded-md">
							<Button
								variant="ghost"
								className="flex flex-col items-center gap-2 hover:bg-white"
							>
								<Plus size={24} className="text-gray-400" />
								<span className="text-muted-foreground">Add section</span>
							</Button>
						</div>
					</>
				)}
			</div>

			<div className="absolute bottom-0 p-8">
				<PreviewModeToggle value={previewMode} onChange={onPreviewModeChange} />
			</div>
		</div>
	);
}
