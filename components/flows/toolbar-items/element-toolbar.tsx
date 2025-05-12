'use client';

import { useState, useRef, useEffect } from 'react';
import {
	ChevronDown,
	Search,
	Image,
	Video,
	Type,
	MousePointer,
	ListOrdered,
	MessageSquare,
	HelpCircle,
	Clock,
	CheckSquare,
	Check,
	Layers,
	FileText,
	MessageCircleQuestionIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createBlock } from '@/lib/addBlockHelpers';
import { AnyBlock } from '@/lib/types/block';

// Element category types
type ElementCategory = 'Basic' | 'Questions' | 'Form (Fields)';

// Element types
interface ElementType {
	id: string;
	name: string;
	icon: React.ReactNode;
	category: ElementCategory;
	onClick?: () => void;
}

interface ElementToolbarProps {
	isOpen: boolean;
	onClose: () => void;
	onAddElement?: (type: AnyBlock) => void;
	insertAfterBlockId?: string | null;
}

export default function ElementToolbar({
	isOpen,
	onClose,
	onAddElement,
	insertAfterBlockId,
}: ElementToolbarProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [expandedCategories, setExpandedCategories] = useState<
		ElementCategory[]
	>(['Basic']);
	const toolbarRef = useRef<HTMLDivElement>(null);

	// Close toolbar when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				toolbarRef.current &&
				!toolbarRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [isOpen, onClose]);

	// Define element types with their icons
	const elementTypes: ElementType[] = [
		// Basic category
		{
			id: 'image',
			name: 'Image',
			icon: <Image size={24} className="text-muted-foreground" />,
			category: 'Basic',
			onClick: () => {
				onAddElement?.(createBlock('Image', 'https://placehold.co/600x400'));
			},
		},
		{
			id: 'video',
			name: 'Video',
			icon: <Video size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'headline',
			name: 'Headline',
			icon: <Type size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'text',
			name: 'Text',
			icon: <FileText size={24} className="text-muted-foreground" />,
			category: 'Basic',
			onClick: () => {
				onAddElement?.(createBlock('Text', '<p>New text</>'));
			},
		},
		{
			id: 'button',
			name: 'Button',
			icon: <MousePointer size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'bullet-points',
			name: 'Bullet points',
			icon: <ListOrdered size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'testimonial',
			name: 'Testimonial',
			icon: <MessageSquare size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'faq',
			name: 'FAQ',
			icon: <HelpCircle size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},
		{
			id: 'countdown',
			name: 'Countdown',
			icon: <Clock size={24} className="text-muted-foreground" />,
			category: 'Basic',
		},

		// Questions category
		{
			id: 'multiple',
			name: 'Multiple',
			icon: <CheckSquare size={24} className="text-muted-foreground" />,
			category: 'Questions',
		},
		{
			id: 'single',
			name: 'Single',
			icon: <Check size={24} className="text-muted-foreground" />,
			category: 'Questions',
		},
		{
			id: 'question-image',
			name: 'Image',
			icon: <Image size={24} className="text-muted-foreground" />,
			category: 'Questions',
		},

		// Form category
		{
			id: 'form-field',
			name: 'Field',
			icon: <Layers size={24} className="text-muted-foreground" />,
			category: 'Form (Fields)',
		},
	];

	// Toggle category expansion
	const toggleCategory = (category: ElementCategory) => {
		if (expandedCategories.includes(category)) {
			setExpandedCategories(expandedCategories.filter((c) => c !== category));
		} else {
			setExpandedCategories([...expandedCategories, category]);
		}
	};

	// Filter elements based on search query
	const filteredElements = searchQuery
		? elementTypes.filter((el) =>
				el.name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: elementTypes;

	// Group elements by category
	const groupedElements: Record<ElementCategory, ElementType[]> = {
		Basic: [],
		Questions: [],
		'Form (Fields)': [],
	};

	filteredElements.forEach((element) => {
		groupedElements[element.category].push(element);
	});

	if (!isOpen) return null;

	return (
		<div
			className="absolute left-24 h-full overflow-y-auto w-80 bg-background border-r border-muted shadow-lg z-40 custom-scrollbar"
			ref={toolbarRef}
		>
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Add elements</h2>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<MessageCircleQuestionIcon />
					</Button>
				</div>

				{/* Search Input */}
				<div className="relative mb-6">
					<div className="relative">
						<Input
							icon={<Search className="w-4 h-4" />}
							type="text"
							placeholder="Search"
							className="w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Categories */}
				<div className="space-y-2 ">
					{Object.keys(groupedElements).map((category) => {
						const elements = groupedElements[category as ElementCategory];
						if (elements.length === 0) return null;

						const isExpanded = expandedCategories.includes(
							category as ElementCategory
						);

						return (
							<div key={category} className="rounded-md overflow-hidden">
								{/* Category Header */}
								<Button
									className="w-full rounded-none flex items-center justify-between border-none p-3 bg-background text-left shadow-none font-bold text-gray-700 hover:bg-background"
									onClick={() => toggleCategory(category as ElementCategory)}
								>
									<span className="text-large">{category}</span>
									<ChevronDown
										className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
											isExpanded ? 'transform rotate-180' : ''
										}`}
									/>
								</Button>

								{/* Elements Grid */}
								{isExpanded && (
									<div className="p-3 bg-white">
										<div className="grid grid-cols-3 gap-2">
											{elements.map((element) => (
												<Button
													variant="ghost"
													key={element.id}
													className="flex flex-col h-full p-4 items-center justify-center rounded-md hover:bg-background transition-colors"
													onClick={() => {
														if (element.onClick) {
															element.onClick();
															onClose();
														}
													}}
												>
													<div className="bg-muted p-6 rounded-md mb-2">
														{element.icon}
													</div>
													<span className="text-xs text-muted-foreground">
														{element.name}
													</span>
												</Button>
											))}
										</div>
									</div>
								)}

								<Separator className="my-2" />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
