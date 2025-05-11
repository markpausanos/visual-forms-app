/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block } from '@/components/blocks/componentMap';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { v4 as uuid } from 'uuid';

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

export function createBlock(type: 'Text' | 'Image', payload: string): Block {
	switch (type) {
		case 'Text':
			return {
				id: uuid(),
				type: 'Text',
				props: {
					html: payload,
					json: htmlToJSON(payload),
				},
			};
		case 'Image':
			return {
				id: uuid(),
				type: 'Image',
				props: {
					html: `<div class="image-container"><img src="${payload}" alt="Image" /></div>`,
					json: `<div class="image-container"><img src="${payload}" alt="Image" /></div>`,
					imageUrl: payload,
					alt: 'Image',
					aspectRatio: '4/3',
				},
			};
		default:
			throw new Error(`Unknown block type: ${type}`);
	}
}
