'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import { type TextBlock, TextBlockProps } from '@/lib/types/block';
import { cn } from '@/lib/utils';

export default function TextBlock({
	block,
	onChange,
}: {
	block: TextBlock;
	onChange: (updated: TextBlock) => void;
}) {
	const [content, setContent] = useState(block.props.html);

	const editor = useEditor({
		content: content,
		editable: true,
		extensions: [
			StarterKit.configure({ heading: false }),
			Bold,
			Italic,
			Underline,
			TextStyle,
			TextAlign.configure({ types: ['paragraph'] }),
		],
		onUpdate: ({ editor }) => {
			setContent(editor.getHTML());
		},
		onBlur: ({ editor }) => {
			const html = editor.getHTML();

			// Get alignment from editor
			const align = editor.getAttributes('textAlign').textAlign;
			const textAlign = align
				? (`text-${align}` as TextBlockProps['textAlign'])
				: block.props.textAlign;

			onChange({
				...block,
				props: {
					...block.props,
					html,
					textAlign,
				},
			});
		},
		editorProps: {
			attributes: {
				class:
					'h-full w-full rounded bg-background p-3 border-none focus:outline-none focus:ring-0',
			},
		},
	});

	// Set initial alignment when editor is ready
	useEffect(() => {
		if (editor && block.props.textAlign) {
			const align = block.props.textAlign.replace('text-', '');
			editor.commands.setTextAlign(align);
		}
	}, [editor, block.props.textAlign]);

	useEffect(() => {
		if (!editor || typeof window === 'undefined') return;
		window.tiptapEditors = window.tiptapEditors || {};
		window.tiptapEditors[block.id] = editor;
		return () => {
			if (!window.tiptapEditors) return;
			delete window.tiptapEditors[block.id];
		};
	}, [editor, block.id]);

	if (!editor) return null;

	return (
		<div
			className={cn('space-y-2', block.props.textAlign, block.props.size)}
			data-block-id={block.id}
		>
			{/* The editor */}
			<EditorContent editor={editor} />
		</div>
	);
}
