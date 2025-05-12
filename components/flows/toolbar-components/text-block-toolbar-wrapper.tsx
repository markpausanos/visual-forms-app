/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TextBlock, TextBlockProps } from '@/lib/types/block';
import {
	AlignLeft,
	AlignCenter,
	Link2,
	ChevronUp,
	ChevronDown,
	AlignRight,
} from 'lucide-react';
import { useCallback } from 'react';

export function TextBlockToolbarWrapper({
	block,
	onChange,
}: {
	block: TextBlock;
	onChange: (id: string, updatedProps: Partial<TextBlockProps>) => void;
}) {
	const editor =
		typeof window !== 'undefined'
			? window.tiptapEditors?.[block.id]
			: undefined;

	const commitChange = useCallback(() => {
		if (!editor) return;
		const html = editor.getHTML();
		onChange(block.id, { html });
	}, [block.id, editor, onChange]);

	if (!editor) return null;

	// Get current alignment from block props or editor
	const currentAlign = block.props.textAlign?.replace('text-', '') || 'left';

	// Get current size from block props or default
	const currentSize = block.props.size?.replace('text-', '') || 'base';

	const textFormatState = {
		bold: editor.isActive('bold'),
		italic: editor.isActive('italic'),
		underline: editor.isActive('underline'),
		size: currentSize,
		align: currentAlign,
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
								: value === 'base'
								? '1rem'
								: value === 'lg'
								? '1.25rem'
								: value === 'xl'
								? '1.5rem'
								: '2rem',
					})
					.run();
				break;
		}
		commitChange();
	};

	const handleAlignChange = (alignment: string) => {
		// Convert alignment to TextBlockProps format
		const textAlign = `text-${alignment}` as TextBlockProps['textAlign'];
		onChange(block.id, { textAlign });
	};

	const handleSizeChange = (size: string) => {
		// Convert size to TextBlockProps format
		const textSize = `text-${size}` as TextBlockProps['size'];
		onChange(block.id, { size: textSize });
	};

	return (
		<TextBlockToolbar
			textFormatState={textFormatState}
			handleTextFormat={handleTextFormat}
			handleAlignChange={handleAlignChange}
			handleSizeChange={handleSizeChange}
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
	handleAlignChange: (alignment: string) => void;
	handleSizeChange: (size: string) => void;
}

export default function TextBlockToolbar({
	textFormatState,
	handleTextFormat,
	handleAlignChange,
	handleSizeChange,
}: Props) {
	return (
		<div className="mt-4 space-y-6">
			{/* Size */}
			<div>
				<p className="font-medium mb-2">Text Size</p>
				<div className="grid grid-cols-4 gap-2">
					{['sm', 'base', 'lg', 'xl', '2xl'].slice(0, 4).map((sz) => (
						<Button
							key={sz}
							variant="outline"
							className={`rounded-full ${
								textFormatState.size === sz
									? 'bg-foreground text-background'
									: ''
							}`}
							onClick={() => {
								handleTextFormat('size', sz);
								handleSizeChange(sz);
							}}
						>
							{sz === 'base' ? 'MD' : sz.toUpperCase()}
						</Button>
					))}
				</div>
			</div>

			{/* Style */}
			<div className="grid grid-cols-3 gap-2">
				<Button
					variant="outline"
					className={`rounded-full font-bold ${
						textFormatState.bold ? 'bg-foreground text-background' : ''
					}`}
					onClick={() => handleTextFormat('bold', true)}
				>
					B
				</Button>
				<Button
					variant="outline"
					className={`rounded-full italic ${
						textFormatState.italic ? 'bg-foreground text-background' : ''
					}`}
					onClick={() => handleTextFormat('italic', true)}
				>
					I
				</Button>
				<Button
					variant="outline"
					className={`rounded-full underline ${
						textFormatState.underline ? 'bg-foreground text-background' : ''
					}`}
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
						className={`rounded-full ${
							textFormatState.align === 'left'
								? 'bg-foreground text-background'
								: ''
						}`}
						onClick={() => {
							handleTextFormat('align', 'left');
							handleAlignChange('left');
						}}
					>
						<AlignLeft size={16} />
					</Button>
					<Button
						variant="outline"
						className={`rounded-full ${
							textFormatState.align === 'center'
								? 'bg-foreground text-background'
								: ''
						}`}
						onClick={() => {
							handleTextFormat('align', 'center');
							handleAlignChange('center');
						}}
					>
						<AlignCenter size={16} />
					</Button>
					<Button
						variant="outline"
						className={`rounded-full ${
							textFormatState.align === 'right'
								? 'bg-foreground text-background'
								: ''
						}`}
						onClick={() => {
							handleTextFormat('align', 'right');
							handleAlignChange('right');
						}}
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
