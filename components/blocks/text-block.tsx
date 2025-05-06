'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import type { Block } from './componentMap';
import { useEffect } from 'react';

export default function TextBlock({
	block,
	onChange,
}: {
	block: Block;
	onChange: (updated: Block) => void;
}) {
	const editor = useEditor({
		content: block.props.json,
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
			const json = editor.getJSON();
			const html = editor.getHTML();
			onChange({
				...block,
				props: {
					html,
					json,
				},
			});
		},
		editorProps: {
			attributes: {
				class:
					'h-full w-full rounded bg-background p-3 focus:outline-none focus:border focus:border-primary focus:ring-0 focus:border-dashed focus:ring-dashed focus:ring-primary/50',
			},
		},
	});

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
		<div className="space-y-2" data-block-id={block.id}>
			{/* The editor */}
			<EditorContent editor={editor} />
		</div>
	);
}
