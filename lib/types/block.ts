export type HtmlOnlyBlock = {
	id: string;
	type: 'Text';
	props: { html: string };
};

export type HtmlOnlyPage = {
	id: string;
	name: string;
	blocks: HtmlOnlyBlock[];
};
