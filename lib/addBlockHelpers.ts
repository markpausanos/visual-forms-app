/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import {
	AnyBlock,
	TextBlock,
	ImageBlock,
	LayoutBlock,
	ColumnWrapperBlock,
	ColumnBlock,
} from '@/lib/types/block';
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

export function createBlock(
	type: AnyBlock['type'],
	payload?: string
): AnyBlock {
	switch (type) {
		case 'Text':
			return {
				id: uuid(),
				type: 'Text',
				props: {
					html: payload || '<p>New text</p>',
					textAlign: 'text-center',
					size: 'text-base',
				},
			} as TextBlock;
		case 'Image':
			return {
				id: uuid(),
				type: 'Image',
				props: {
					src: payload || '/placeholder-image.svg',
					alt: 'Image',
					aspectRatio: 'aspect-auto',
					cornerRadius: 0,
					shadow: 0,
					fullHeight: false,
					fullSize: true,
				},
			} as ImageBlock;
		case 'Layout':
			return {
				id: uuid(),
				type: 'Layout',
				props: {
					gap: 16,
				},
				children: [
					{
						id: uuid(),
						type: 'Text',
						props: {
							html: payload || '<p>New text</p>',
						},
					},
					{
						id: uuid(),
						type: 'Text',
						props: {
							html: payload || '<p>New text</p>',
						},
					},
				],
			} as LayoutBlock;
		case 'ColumnWrapper':
			return {
				id: uuid(),
				type: 'ColumnWrapper',
				props: {
					gap: 16,
					backgroundColor: 'transparent',
				},
				children: [
					createBlock('Column') as ColumnBlock,
					createBlock('Column') as ColumnBlock,
				],
			} as ColumnWrapperBlock;
		case 'Column':
			return {
				id: uuid(),
				type: 'Column',
				props: {
					padding: 16,
					backgroundColor: 'transparent',
				},
				children: [],
			} as ColumnBlock;
		default:
			throw new Error(`Unknown block type: ${type}`);
	}
}
