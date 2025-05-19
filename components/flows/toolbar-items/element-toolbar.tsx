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
	Plus,
	X,
	ArrowLeft,
	Trash2,
	StickyNote,
	Layout,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createBlock } from '@/lib/addBlockHelpers';
import { AnyBlock } from '@/lib/types/block';
import { uploadImageToStorage } from '@/actions/upload-storage';
import { deleteUserImage, getUserImages } from '@/actions/storage';
import { toast } from 'sonner';

// Element category types
type ElementCategory = 'Basic' | 'Questions' | 'Form (Fields)';
type ToolbarView = 'elements' | 'images';

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
	onAddElementAfter?: (
		type: AnyBlock,
		afterBlockId: string,
		layoutBlockId?: string | null
	) => void;
	onUpdateBlock?: (
		blockId: string,
		updatedProps: Partial<AnyBlock['props']>
	) => void;
	insertAfterBlockId?: string | null;
	replacingBlockId?: string | null;
	initialView?: ToolbarView;
}

export default function ElementToolbar({
	isOpen,
	onClose,
	onAddElement,
	onAddElementAfter,
	onUpdateBlock,
	insertAfterBlockId = null,
	replacingBlockId = null,
	initialView = 'elements',
}: ElementToolbarProps) {
	// Main state
	const [currentView, setCurrentView] = useState<ToolbarView>(initialView);
	const [searchQuery, setSearchQuery] = useState('');
	const [expandedCategories, setExpandedCategories] = useState<
		ElementCategory[]
	>(['Basic']);
	const toolbarRef = useRef<HTMLDivElement>(null);

	// Image toolbar state
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [userImages, setUserImages] = useState<
		{ name: string; url: string; size?: number; createdAt?: string }[]
	>([]);

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

	// Fetch user images when image view is opened
	useEffect(() => {
		async function fetchUserImages() {
			if (isOpen && currentView === 'images') {
				setIsLoading(true);
				try {
					const images = await getUserImages();
					setUserImages(images);
				} catch (error) {
					console.error('Error fetching images:', error);
					toast.error('Failed to load your images');
				} finally {
					setIsLoading(false);
				}
			}
		}

		fetchUserImages();
	}, [isOpen, currentView]);

	// Effect to update view when initialView changes
	useEffect(() => {
		if (isOpen && initialView) {
			setCurrentView(initialView);

			// If initialView is "images", also fetch the images
			if (initialView === 'images') {
				async function fetchImages() {
					setIsLoading(true);
					try {
						const images = await getUserImages();
						setUserImages(images);
					} catch (error) {
						console.error('Error fetching images:', error);
						toast.error('Failed to load your images');
					} finally {
						setIsLoading(false);
					}
				}
				fetchImages();
			}
		}
	}, [initialView, isOpen]);

	useEffect(() => {
		if (!isOpen) {
			// Only reset view when toolbar is actually closed, not just re-rendered
			setTimeout(() => {
				if (!isOpen) {
					setCurrentView('elements');
				}
			}, 100);
		}
	}, [isOpen]);

	// Define element types with their icons
	const elementTypes: ElementType[] = [
		// Basic category
		{
			id: 'image',
			name: 'Image',
			icon: <Image size={24} className="text-muted-foreground" />,
			category: 'Basic',
			onClick: () => {
				// Create image block with default placeholder
				const defaultImageUrl = '/placeholder-image.svg'; // Using the SVG placeholder we created
				if (insertAfterBlockId) {
					onAddElementAfter?.(
						createBlock('Image', defaultImageUrl),
						insertAfterBlockId
					);
				} else {
					onAddElement?.(createBlock('Image', defaultImageUrl));
				}
				onClose();
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
				if (insertAfterBlockId) {
					onAddElementAfter?.(
						createBlock('Text', '<p>New text</>'),
						insertAfterBlockId
					);
				} else {
					onAddElement?.(createBlock('Text', '<p>New text</>'));
				}
				onClose();
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
		// for testing Layout block
		{
			id: 'layout',
			name: 'Layout',
			icon: <Layout size={24} className="text-muted-foreground" />,
			category: 'Basic',
			onClick: () => {
				if (insertAfterBlockId) {
					onAddElementAfter?.(
						createBlock('Layout', '<p>Hello</p>'),
						insertAfterBlockId
					);
				} else {
					onAddElement?.(createBlock('Layout', '<p>Hello</p>'));
				}
				onClose();
			},
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

	// Image toolbar handlers
	const handleSelectImage = (imageUrl: string, keepOpen = false) => {
		if (replacingBlockId) {
			// If we're replacing an image, update the existing block
			onUpdateBlock?.(replacingBlockId, { src: imageUrl });
		} else if (insertAfterBlockId) {
			// If we're adding after a block
			onAddElementAfter?.(createBlock('Image', imageUrl), insertAfterBlockId);
		} else {
			// If we're just adding a new image
			onAddElement?.(createBlock('Image', imageUrl));
		}

		if (!keepOpen) {
			onClose();
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 8 * 1024 * 1024) {
			toast.error('File too large (max 8MB)');
			return;
		}

		e.target.value = '';
		setIsUploading(true);

		try {
			await uploadImageToStorage(file);

			// Update the image gallery without closing
			const images = await getUserImages();
			setUserImages(images);

			toast.success('Image uploaded successfully');
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error('Failed to upload image');
		} finally {
			setIsUploading(false);
		}
	};

	const handleDeleteImage = async (imageName: string) => {
		try {
			setUserImages(userImages.filter((img) => img.name !== imageName));
			await deleteUserImage(imageName);
			toast.success('Image deleted successfully');
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

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

	// Filter images based on search query
	const filteredImages = searchQuery
		? userImages.filter((img) =>
				img.name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: userImages;

	if (!isOpen) return null;

	// Common wrapper
	return (
		<div
			className="absolute left-24 h-full overflow-y-auto w-80 bg-background border-r border-muted shadow-lg z-40 custom-scrollbar"
			ref={toolbarRef}
		>
			{currentView === 'elements' ? (
				// Elements View
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
								type="text"
								placeholder="Search"
								className="w-full"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						</div>
					</div>

					{/* Categories */}
					<div className="space-y-2">
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
			) : (
				// Image View
				<div className="p-4">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentView('elements')}
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
							<h2 className="text-xl font-bold">Images</h2>
						</div>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-5 w-5" />
						</Button>
					</div>

					<div className="relative mb-6">
						<div className="relative">
							<Input
								placeholder="Search images"
								className="w-full"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 mb-6">
						{isLoading ? (
							Array(4)
								.fill(0)
								.map((_, index) => (
									<div
										key={index}
										className="bg-muted rounded-md aspect-square animate-pulse"
									/>
								))
						) : filteredImages.length > 0 ? (
							filteredImages.map((image, index) => (
								<div
									key={index}
									className="relative group cursor-pointer"
									onClick={() => handleSelectImage(image.url)}
								>
									<div className="bg-muted rounded-md aspect-square overflow-hidden">
										<img
											src={image.url}
											alt={image.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<p className="text-xs mt-1 truncate">{image.name}</p>

									<div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-70">
										<Button
											size="icon"
											variant="ghost"
											className="text-black absolute"
										>
											<Plus className="h-6 w-6" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="text-destructive absolute top-2 right-2"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteImage(image.name);
											}}
										>
											<Trash2 className="h-5 w-5" />
										</Button>
									</div>
								</div>
							))
						) : (
							<>
								<div className="flex flex-col items-center justify-center h-full w-full gap-2 bg-muted rounded-md aspect-square">
									<StickyNote className="h-6 w-6 text-muted-foreground" />
									<p className="text-muted-foreground text-center text-xs">
										No images found
									</p>
								</div>
							</>
						)}
					</div>

					<Separator className="my-4" />

					<div>
						<h3 className="text-lg font-medium mb-4">Your images</h3>

						<Button
							variant="outline"
							className="w-full flex items-center justify-center gap-2"
							onClick={() => document.getElementById('image-upload')?.click()}
							disabled={isUploading}
						>
							{isUploading ? (
								'Uploading...'
							) : (
								<>
									<Plus size={16} />
									Add New
								</>
							)}
							<Input
								id="image-upload"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleFileUpload}
								disabled={isUploading}
							/>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
