'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ImageBlock, ImageBlockProps } from '@/lib/types/block';
import { CornerUpLeft, Circle, Square } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ImageBlockToolbarWrapper({
	block,
	onChange,
	openImageSelector,
}: {
	block: ImageBlock;
	onChange: (id: string, updatedProps: Partial<ImageBlockProps>) => void;
	openImageSelector?: (blockId: string) => void;
}) {
	// Initialize state from block props
	const [aspectRatio, setAspectRatio] = useState<
		ImageBlockProps['aspectRatio']
	>(block.props.aspectRatio || 'aspect-auto');
	const [cornerRadius, setCornerRadius] = useState(
		block.props.cornerRadius || 0
	);
	const [shadow, setShadow] = useState(block.props.shadow || 0);
	const [fullHeight, setFullHeight] = useState(block.props.fullHeight || false);
	const [fullSize, setFullSize] = useState(block.props.fullSize || false);

	// Update local state when block props change
	useEffect(() => {
		setAspectRatio(block.props.aspectRatio || 'aspect-auto');
		setCornerRadius(block.props.cornerRadius || 0);
		setShadow(block.props.shadow || 0);
		setFullHeight(block.props.fullHeight || false);
		setFullSize(block.props.fullSize || false);
	}, [block.props]);

	// Handler for aspect ratio change
	const handleAspectRatioChange = (value: string) => {
		const newRatio = value as ImageBlockProps['aspectRatio'];
		setAspectRatio(newRatio);
		onChange(block.id, { aspectRatio: newRatio });
	};

	// Open image selector in main canvas
	const handleReplaceImage = () => {
		if (openImageSelector) {
			openImageSelector(block.id);
		}
	};

	return (
		<div className="p-3 space-y-6 w-full">
			<h2 className="text-lg font-semibold">Image</h2>

			{/* Image preview */}
			<div className="bg-muted rounded-md aspect-video flex items-center justify-center relative overflow-hidden">
				{block.props.src ? (
					<img
						src={block.props.src}
						className="max-w-full max-h-full object-contain"
					/>
				) : (
					<div className="bg-gray-200 w-full h-full flex items-center justify-center">
						<div className="bg-gray-300 w-1/2 h-1/2 rounded-lg"></div>
					</div>
				)}
			</div>

			{/* Image info */}
			<div className="flex flex-col">
				<p className="text-xs font-medium truncate">
					{block.props.src ? block.props.src.split('/').pop() : 'Image'}
				</p>
			</div>

			{/* Replace Image button - ensure it calls handleReplaceImage */}
			<Button
				variant="outline"
				className="w-full flex items-center justify-center gap-2"
				onClick={handleReplaceImage}
			>
				<CornerUpLeft size={16} />
				Replace Image
			</Button>

			<div className="border-t pt-4">
				<h3 className="text-lg font-medium mb-4">Proportions</h3>

				<RadioGroup
					value={aspectRatio}
					onValueChange={handleAspectRatioChange}
					className="flex flex-wrap gap-2 mb-4"
				>
					<div className="flex items-center space-x-2 border rounded-lg px-4 py-2">
						<RadioGroupItem value="aspect-video" id="ratio-16-9" />
						<Label htmlFor="ratio-16-9">16:9</Label>
					</div>

					<div className="flex items-center space-x-2 border rounded-lg px-4 py-2">
						<RadioGroupItem value="aspect-[9/16]" id="ratio-9-16" />
						<Label htmlFor="ratio-9-16">9:16</Label>
					</div>

					<div className="flex items-center space-x-2 border rounded-lg px-4 py-2">
						<RadioGroupItem value="aspect-square" id="ratio-1-1" />
						<Label htmlFor="ratio-1-1">1:1</Label>
					</div>
				</RadioGroup>
			</div>

			<div className="border-t pt-4">
				<h3 className="text-lg font-medium mb-4">Style</h3>

				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
							<Circle size={20} />
						</div>
						<span>Corner Radius</span>
					</div>
					<span className="font-medium">{cornerRadius}px</span>
				</div>

				<Slider
					value={[cornerRadius || 0]}
					max={30}
					step={1}
					onValueChange={(values) => {
						const value = values[0];
						setCornerRadius(value);
						onChange(block.id, { cornerRadius: value });
					}}
					className="my-4"
				/>

				<div className="flex justify-between items-center mb-4 mt-6">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
							<Square size={20} />
						</div>
						<span>Shadow</span>
					</div>
					<span className="font-medium">{shadow}%</span>
				</div>

				<Slider
					value={[shadow || 0]}
					max={100}
					step={1}
					onValueChange={(values) => {
						const value = values[0];
						setShadow(value);
						onChange(block.id, { shadow: value });
					}}
					className="my-4"
				/>
			</div>

			<div className="border-t pt-4 space-y-4">
				<div className="flex items-center justify-between">
					<Label htmlFor="full-height" className="font-medium">
						Full Height
					</Label>
					<Switch
						id="full-height"
						checked={fullHeight}
						onCheckedChange={(checked) => {
							setFullHeight(checked);
							onChange(block.id, { fullHeight: checked });
						}}
					/>
				</div>

				<div className="flex items-center justify-between">
					<Label htmlFor="full-size" className="font-medium">
						Full Size
					</Label>
					<Switch
						id="full-size"
						checked={fullSize}
						onCheckedChange={(checked) => {
							setFullSize(checked);
							onChange(block.id, { fullSize: checked });
						}}
					/>
				</div>
			</div>
		</div>
	);
}
