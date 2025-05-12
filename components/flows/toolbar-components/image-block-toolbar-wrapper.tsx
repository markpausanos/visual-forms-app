'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageBlock, ImageBlockProps } from '@/lib/types/block';
import {
	Upload,
	Square,
	Tv,
	Monitor,
	Circle,
	Sun,
	SquareRoundCorner,

} from 'lucide-react';
import { useState } from 'react';

export function ImageBlockToolbarWrapper({
	block,
	onChange,
}: {
	block: ImageBlock;
	onChange: (id: string, updatedProps: Partial<ImageBlockProps>) => void;
}) {
	// Initialize state from block props
	const [src, setSrc] = useState(block.props.src || '');
	const [alt, setAlt] = useState(block.props.alt || 'Image');
	const [href, setHref] = useState(block.props.href || '');
	const [aspectRatio, setAspectRatio] = useState<
		ImageBlockProps['aspectRatio']
	>(block.props.aspectRatio || 'aspect-auto');
	const [cornerRadius, setCornerRadius] = useState<
		ImageBlockProps['cornerRadius']
	>(block.props.cornerRadius || 'rounded-none');
	const [shadow, setShadow] = useState<ImageBlockProps['shadow']>(
		block.props.shadow || 'shadow-none'
	);

	// Handle file upload
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Reset the file input
		e.target.value = '';

		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setSrc(result);
			onChange(block.id, { src: result });
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="p-3 space-y-4">
			<div className="space-y-2">
				<Label htmlFor="image-url">Image URL</Label>
				<div className="flex gap-2">
					<Input
						id="image-url"
						value={src}
						onChange={(e) => {
							setSrc(e.target.value);
							onChange(block.id, { src: e.target.value });
						}}
						placeholder="https://example.com/image.jpg"
					/>
					<Label
						htmlFor="file-upload"
						className="cursor-pointer px-2 py-1 bg-muted rounded-md flex items-center"
					>
						<Upload size={16} />
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileUpload}
						/>
					</Label>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="alt-text">Alt Text</Label>
				<Input
					id="alt-text"
					value={alt}
					onChange={(e) => {
						setAlt(e.target.value);
						onChange(block.id, { alt: e.target.value });
					}}
					placeholder="Image description"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="link-url">Link URL (optional)</Label>
				<Input
					id="link-url"
					value={href || ''}
					onChange={(e) => {
						setHref(e.target.value);
						onChange(block.id, { href: e.target.value || undefined });
					}}
					placeholder="https://example.com"
				/>
			</div>

			<div className="space-y-2">
				<Label>Aspect Ratio</Label>
				<div className="flex gap-2">
					<Button
						variant={aspectRatio === 'aspect-square' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setAspectRatio('aspect-square');
							onChange(block.id, { aspectRatio: 'aspect-square' });
						}}
						title="Square (1:1)"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={aspectRatio === 'aspect-video' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setAspectRatio('aspect-video');
							onChange(block.id, { aspectRatio: 'aspect-video' });
						}}
						title="Widescreen (16:9)"
					>
						<Tv size={16} />
					</Button>
					<Button
						variant={aspectRatio === 'aspect-auto' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setAspectRatio('aspect-auto');
							onChange(block.id, { aspectRatio: 'aspect-auto' });
						}}
						title="Auto"
					>
						<Monitor size={16} />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Corner Radius</Label>
				<div className="flex gap-2">
					<Button
						variant={cornerRadius === 'rounded-none' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setCornerRadius('rounded-none');
							onChange(block.id, { cornerRadius: 'rounded-none' });
						}}
						title="No Radius"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={cornerRadius === 'rounded-md' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setCornerRadius('rounded-md');
							onChange(block.id, { cornerRadius: 'rounded-md' });
						}}
						title="Medium Radius"
					>
						<SquareRoundCorner size={16} />
					</Button>
					<Button
						variant={cornerRadius === 'rounded-full' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setCornerRadius('rounded-full');
							onChange(block.id, { cornerRadius: 'rounded-full' });
						}}
						title="Rounded"
					>
						<Circle size={16} />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Shadow</Label>
				<div className="flex gap-2">
					<Button
						variant={shadow === 'shadow-none' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setShadow('shadow-none');
							onChange(block.id, { shadow: 'shadow-none' });
						}}
						title="No Shadow"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={shadow === 'shadow-sm' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setShadow('shadow-sm');
							onChange(block.id, { shadow: 'shadow-sm' });
						}}
						title="Small Shadow"
					>
						<Sun size={16} className="opacity-30" />
					</Button>
					<Button
						variant={shadow === 'shadow-md' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setShadow('shadow-md');
							onChange(block.id, { shadow: 'shadow-md' });
						}}
						title="Medium Shadow"
					>
						<Sun size={16} className="opacity-60" />
					</Button>
					<Button
						variant={shadow === 'shadow-lg' ? 'default' : 'outline'}
						size="icon"
						onClick={() => {
							setShadow('shadow-lg');
							onChange(block.id, { shadow: 'shadow-lg' });
						}}
						title="Large Shadow"
					>
						<Sun size={16} />
					</Button>
				</div>
			</div>
		</div>
	);
}
