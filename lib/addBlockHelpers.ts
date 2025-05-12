/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import { AnyBlock, TextBlock, ImageBlock } from '@/lib/types/block';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

export function htmlToJSON(html: string) {
	const editor = new Editor({
		extensions: [StarterKit],
		content: html,
	});
	const json = editor.getJSON();
	editor.destroy();
	return json;
}

export function jsonToHTML(json: any) {
	const editor = new Editor({
		extensions: [StarterKit],
	});
	editor.commands.setContent(json);
	const html = editor.getHTML();
	editor.destroy();
	return html;
}

export function createBlock(type: AnyBlock['type'], payload: string): AnyBlock {
	switch (type) {
		case 'Text':
			return {
				id: uuid(),
				type: 'Text',
				props: {
					html: payload,
					textAlign: 'text-center',
					size: 'text-base',
				},
			} as TextBlock;
		case 'Image':
			return {
				id: uuid(),
				type: 'Image',
				props: {
					src: payload,
					alt: 'Image',
					aspectRatio: 'aspect-auto',
					cornerRadius: 'rounded-md',
					shadow: 'shadow-sm',
				},
			} as ImageBlock;
		default:
			throw new Error(`Unknown block type: ${type}`);
	}
}
