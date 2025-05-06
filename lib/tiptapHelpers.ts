/* eslint-disable @typescript-eslint/no-explicit-any */
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
