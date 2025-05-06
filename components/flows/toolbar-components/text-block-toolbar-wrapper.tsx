/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block } from '@/components/blocks/componentMap';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
	AlignLeft,
	AlignCenter,
	Link2,
	ChevronUp,
	ChevronDown,
	AlignRight,
} from 'lucide-react';

export function TextBlockToolbarWrapper({ block }: { block: Block }) {
	const editor =
		typeof window !== 'undefined'
			? window.tiptapEditors?.[block.id]
			: undefined;

	if (!editor) return null;

	// determine exactly which alignment is active
	const align = editor.isActive('textAlign', { align: 'left' })
		? 'left'
		: editor.isActive('textAlign', { align: 'center' })
			? 'center'
			: editor.isActive('textAlign', { align: 'right' })
				? 'right'
				: 'left';

	const textFormatState = {
		bold: editor.isActive('bold'),
		italic: editor.isActive('italic'),
		underline: editor.isActive('underline'),
		align,
		size: (editor.getAttributes('textStyle').fontSize as string) || 'md',
	};

	const handleTextFormat = (key: string, value: any) => {
		switch (key) {
			case 'bold':
				editor.chain().focus().toggleBold().run();
				break;
			case 'italic':
				editor.chain().focus().toggleItalic().run();
				break;
			case 'underline':
				editor.chain().focus().toggleUnderline().run();
				break;
			case 'align':
				editor.chain().focus().setTextAlign(value).run();
				break;
			case 'size':
				editor
					.chain()
					.focus()
					.setMark('textStyle', {
						fontSize:
							value === 'sm'
								? '0.75rem'
								: value === 'md'
									? '1rem'
									: value === 'lg'
										? '1.25rem'
										: '1.5rem',
					})
					.run();
				break;
		}
		// onUpdate in TextBlock will push JSON/html back into your pages state
	};

	return (
		<TextBlockToolbar
			textFormatState={textFormatState}
			handleTextFormat={handleTextFormat}
		/>
	);
}

interface Props {
	textFormatState: {
		bold: boolean;
		italic: boolean;
		underline: boolean;
		align: string;
		size: string;
	};
	handleTextFormat: (key: string, value: string | boolean) => void;
}

export default function TextBlockToolbar({
	textFormatState,
	handleTextFormat,
}: Props) {
	return (
		<div className="mt-4 space-y-6">
			{/* Size */}
			<div>
				<p className="font-medium mb-2">Text Size</p>
				<div className="grid grid-cols-4 gap-2">
					{['sm', 'md', 'lg', 'xl'].map((sz) => (
						<Button
							key={sz}
							variant="outline"
							className={`rounded-full ${textFormatState.size === sz ? 'bg-background text-foreground' : ''}`}
							onClick={() => handleTextFormat('size', sz)}
						>
							{sz.toUpperCase()}
						</Button>
					))}
				</div>
			</div>

			{/* Style */}
			<div className="grid grid-cols-3 gap-2">
				<Button
					variant="outline"
					className={`rounded-full font-bold ${textFormatState.bold ? 'bg-background text-foreground' : ''}`}
					onClick={() => handleTextFormat('bold', true)}
				>
					B
				</Button>
				<Button
					variant="outline"
					className={`rounded-full italic ${textFormatState.italic ? 'bg-background text-foreground' : ''}`}
					onClick={() => handleTextFormat('italic', true)}
				>
					I
				</Button>
				<Button
					variant="outline"
					className={`rounded-full underline ${textFormatState.underline ? 'bg-background text-foreground' : ''}`}
					onClick={() => handleTextFormat('underline', true)}
				>
					U
				</Button>
			</div>

			{/* Alignment */}
			<div>
				<p className="font-medium mb-2">Alignment</p>
				<div className="grid grid-cols-3 gap-2">
					<Button
						variant="outline"
						className={`rounded-full ${textFormatState.align === 'left' ? 'bg-background text-foreground' : ''}`}
						onClick={() => handleTextFormat('align', 'left')}
					>
						<AlignLeft size={16} />
					</Button>
					<Button
						variant="outline"
						className={`rounded-full ${textFormatState.align === 'center' ? 'bg-background text-foreground' : ''}`}
						onClick={() => handleTextFormat('align', 'center')}
					>
						<AlignCenter size={16} />
					</Button>
					<Button
						variant="outline"
						className={`rounded-full ${textFormatState.align === 'right' ? 'bg-background text-foreground' : ''}`}
						onClick={() => handleTextFormat('align', 'right')}
					>
						<AlignRight size={16} />
					</Button>
				</div>
			</div>

			{/* Background controls (unchanged) */}
			<div>
				<p className="font-medium mb-2">Background</p>
				<Slider defaultValue={[50]} className="my-4" />
				<div className="grid grid-cols-3 gap-2">
					<Button variant="outline" className="rounded-full">
						<ChevronUp size={16} />
					</Button>
					<Button variant="outline" className="rounded-full">
						<Link2 size={16} />
					</Button>
					<Button variant="outline" className="rounded-full">
						<ChevronDown size={16} />
					</Button>
				</div>
			</div>
		</div>
	);
}
