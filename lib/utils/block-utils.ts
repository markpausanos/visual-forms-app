import { AnyBlock, TextBlock, ImageBlock } from '../types/block';

export const blockMapper = (block: AnyBlock): AnyBlock => {
	if (block.type === 'Text') {
		return {
			id: block.id,
			type: block.type,
			props: {
				html: block.props.html,
				textAlign: block.props.textAlign,
				size: block.props.size,
			},
		} as TextBlock;
	}

	if (block.type === 'Image') {
		return {
			id: block.id,
			type: block.type,
			props: {
				src: block.props.src,
				alt: block.props.alt,
				href: block.props.href,
				aspectRatio: block.props.aspectRatio,
				cornerRadius: block.props.cornerRadius,
				shadow: block.props.shadow,
			},
		} as ImageBlock;
	}

	return block;
};
