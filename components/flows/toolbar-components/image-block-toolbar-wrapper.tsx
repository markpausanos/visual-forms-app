'use client';

import { Block } from '@/components/blocks/componentMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Upload,
	Square,
	Tv,
	Monitor,
	Circle,
	Sun,
	SquareRoundCorner,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function ImageBlockToolbarWrapper({
	block,
	onChange,
}: {
	block: Block;
	onChange: (id: string, html: string) => void;
}) {
	const [imageUrl, setImageUrl] = useState(block.props.imageUrl || '');
	const [altText, setAltText] = useState(block.props.alt || 'Image');
	const [aspectRatio, setAspectRatio] = useState(
		block.props.aspectRatio || '4/3'
	);
	const [cornerRadius, setCornerRadius] = useState(
		block.props.cornerRadius || '0'
	);
	const [shadow, setShadow] = useState(block.props.shadow || 'none');

	// Initialize state by extracting from HTML
	useEffect(() => {
		if (block.props.html) {
			// Extract image URL from HTML
			const urlMatch = block.props.html.match(/src=["']([^"']*)["']/);
			if (urlMatch && urlMatch[1]) {
				setImageUrl(urlMatch[1]);
			}

			// Extract alt text from HTML
			const altMatch = block.props.html.match(/alt=["']([^"']*)["']/);
			if (altMatch && altMatch[1]) {
				setAltText(altMatch[1]);
			}

			// Extract aspect ratio from HTML classes
			if (block.props.html.includes('aspect-square')) {
				setAspectRatio('1/1');
			} else if (block.props.html.includes('aspect-video')) {
				setAspectRatio('16/9');
			} else if (block.props.html.includes('aspect-[4/3]')) {
				setAspectRatio('4/3');
			}

			// Extract corner radius from HTML classes
			if (block.props.html.includes('rounded-md')) {
				setCornerRadius('md');
			} else if (block.props.html.includes('rounded-full')) {
				setCornerRadius('full');
			} else {
				setCornerRadius('0');
			}

			// Extract shadow from HTML classes
			if (block.props.html.includes('shadow-sm')) {
				setShadow('sm');
			} else if (block.props.html.includes('shadow-md')) {
				setShadow('md');
			} else if (block.props.html.includes('shadow-lg')) {
				setShadow('lg');
			} else {
				setShadow('none');
			}
		}
	}, [block.props.html]);

	// Simplify to just update HTML with Tailwind classes
	const updateHtmlWithClasses = (updates: {
		imageUrl?: string;
		altText?: string;
		aspectRatio?: '1/1' | '16/9' | '4/3' | 'auto';
		cornerRadius?: '0' | 'md' | 'full';
		shadow?: 'none' | 'sm' | 'md' | 'lg';
	}) => {
		// Update local state
		if (updates.imageUrl) setImageUrl(updates.imageUrl);
		if (updates.altText) setAltText(updates.altText);
		if (updates.aspectRatio) setAspectRatio(updates.aspectRatio);
		if (updates.cornerRadius) setCornerRadius(updates.cornerRadius);
		if (updates.shadow) setShadow(updates.shadow);

		// Get aspect ratio class
		let aspectClass = '';
		switch (updates.aspectRatio || aspectRatio) {
			case '1/1':
				aspectClass = 'aspect-square';
				break;
			case '16/9':
				aspectClass = 'aspect-video';
				break;
			case '4/3':
				aspectClass = 'aspect-[4/3]';
				break;
			default:
				aspectClass = 'aspect-[4/3]';
		}

		// Get corner radius class
		let radiusClass = '';
		switch (updates.cornerRadius || cornerRadius) {
			case '0':
				radiusClass = 'rounded-none';
				break;
			case 'md':
				radiusClass = 'rounded-md';
				break;
			case 'full':
				radiusClass = 'rounded-full';
				break;
			default:
				radiusClass = 'rounded-none';
		}

		// Get shadow class
		let shadowClass = '';
		switch (updates.shadow || shadow) {
			case 'none':
				shadowClass = '';
				break;
			case 'sm':
				shadowClass = 'shadow-sm';
				break;
			case 'md':
				shadowClass = 'shadow-md';
				break;
			case 'lg':
				shadowClass = 'shadow-lg';
				break;
			default:
				shadowClass = '';
		}

		// Create HTML with all styling as Tailwind classes
		const html = `
			<div class="relative overflow-hidden mx-auto ${aspectClass} ${shadowClass}">
				<img src="${updates.imageUrl || imageUrl}" 
					 alt="${updates.altText || altText}" 
					 class="absolute inset-0 w-full h-full object-cover ${radiusClass}"
				/>
			</div>
		`;

		// Just send the HTML
		onChange(block.id, html.trim());
	};

	// Handle image update
	const handleUpdateImage = () => {
		if (!imageUrl) return;
		updateHtmlWithClasses({}); // Updates with current values
	};

	// Handle aspect ratio change
	const handleAspectRatio = (ratio: '1/1' | '16/9' | '4/3' | 'auto') => {
		updateHtmlWithClasses({ aspectRatio: ratio });
	};

	// Handle corner radius change
	const handleCornerRadius = (radius: string) => {
		updateHtmlWithClasses({ cornerRadius: radius });
	};

	// Handle shadow change
	const handleShadow = (shadowType: 'none' | 'sm' | 'md' | 'lg') => {
		updateHtmlWithClasses({ shadow: shadowType });
	};

	// Handle file upload
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Reset the file input
		e.target.value = '';

		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			updateHtmlWithClasses({ imageUrl: result });
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
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
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
					value={altText}
					onChange={(e) => setAltText(e.target.value)}
					placeholder="Image description"
				/>
			</div>

			<div className="space-y-2">
				<Label>Aspect Ratio</Label>
				<div className="flex gap-2">
					<Button
						variant={aspectRatio === '1/1' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleAspectRatio('1/1')}
						title="Square (1:1)"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={aspectRatio === '16/9' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleAspectRatio('16/9')}
						title="Widescreen (16:9)"
					>
						<Tv size={16} />
					</Button>
					<Button
						variant={aspectRatio === '4/3' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleAspectRatio('4/3')}
						title="Standard (4:3)"
					>
						<Monitor size={16} />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<Label>Corner Radius</Label>
				<div className="flex gap-2">
					<Button
						variant={cornerRadius === '0' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleCornerRadius('0')}
						title="No Radius"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={cornerRadius === 'md' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleCornerRadius('md')}
						title="Medium Radius"
					>
						<SquareRoundCorner size={16} />
					</Button>
					<Button
						variant={cornerRadius === 'full' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleCornerRadius('full')}
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
						variant={shadow === 'none' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleShadow('none')}
						title="No Shadow"
					>
						<Square size={16} />
					</Button>
					<Button
						variant={shadow === 'sm' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleShadow('sm')}
						title="Small Shadow"
					>
						<Sun size={16} className="opacity-30" />
					</Button>
					<Button
						variant={shadow === 'md' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleShadow('md')}
						title="Medium Shadow"
					>
						<Sun size={16} className="opacity-60" />
					</Button>
					<Button
						variant={shadow === 'lg' ? 'default' : 'outline'}
						size="icon"
						onClick={() => handleShadow('lg')}
						title="Large Shadow"
					>
						<Sun size={16} />
					</Button>
				</div>
			</div>

			<Button onClick={handleUpdateImage} className="w-full">
				Update Image
			</Button>
		</div>
	);
}
