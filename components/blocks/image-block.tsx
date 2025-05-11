'use client';

import type { Block } from './componentMap';

export default function ImageBlock({
	block,
	onChange,
}: {
	block: Block;
	onChange: (updated: Block) => void;
}) {
	// Just render the HTML
	return (
		<div
			className="py-2 px-0 focus-within:outline-dashed focus-within:outline-primary/50"
			data-block-id={block.id}
			dangerouslySetInnerHTML={{ __html: block.props.html || '' }}
		/>
	);
}
