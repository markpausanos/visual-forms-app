'use client';

import { useState, useEffect } from 'react';
import { Grid3X3, PenTool, MessageSquare } from 'lucide-react';
import ElementToolbar from './toolbar-items/element-toolbar';
import { AnyBlock } from '@/lib/types/block';

type ActiveTool = 'elements' | 'sections' | 'design' | 'ai-chat' | null;

interface MainToolbarProps {
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
	showElementToolbar?: boolean;
	setShowElementToolbar?: (show: boolean) => void;
	showImageToolbar?: boolean;
	setShowImageToolbar?: (show: boolean) => void;
}

export default function MainToolbar({
	onAddElement,
	onAddElementAfter,
	onUpdateBlock,
	insertAfterBlockId = null,
	replacingBlockId = null,
	showElementToolbar = false,
	setShowElementToolbar,
	showImageToolbar = false,
	setShowImageToolbar,
}: MainToolbarProps) {
	const [activeTool, setActiveTool] = useState<ActiveTool>(null);
	const [hoveredTool, setHoveredTool] = useState<ActiveTool>(null);
	const [isHovering, setIsHovering] = useState(false);

	// Handle tool click
	const handleToolClick = (tool: ActiveTool) => {
		if (activeTool === tool) {
			setActiveTool(null); // Toggle off if already active
			setShowElementToolbar?.(false);
		} else {
			setActiveTool(tool); // Activate the clicked tool
			if (tool === 'elements') {
				setShowElementToolbar?.(true);
			} else {
				setShowElementToolbar?.(false);
			}
		}
	};

	// Handle mouse enter
	const handleMouseEnter = (tool: ActiveTool) => {
		setHoveredTool(tool);
		setIsHovering(true);
	};

	// Handle mouse leave
	const handleMouseLeave = () => {
		setIsHovering(false);
		setTimeout(() => {
			if (!isHovering) {
				setHoveredTool(null);
			}
		}, 100);
	};

	// Force show element toolbar when inserting after a block or when externally requested
	useEffect(() => {
		if (insertAfterBlockId || showElementToolbar) {
			setActiveTool('elements');
		}

		// When an external component wants to show the image toolbar
		if (showImageToolbar && showElementToolbar) {
			setActiveTool('elements');
		}
	}, [insertAfterBlockId, showElementToolbar, showImageToolbar]);

	// Handle close of Element Toolbar
	const handleCloseToolbar = () => {
		setActiveTool(null);
		setHoveredTool(null);
		setShowElementToolbar?.(false);
		setShowImageToolbar?.(false);
	};

	// Handle element add with context
	const handleElementAdd = (block: AnyBlock) => {
		if (insertAfterBlockId) {
			onAddElementAfter?.(block, insertAfterBlockId, null);
		} else {
			onAddElement?.(block);
		}
	};

	return (
		<div className="flex h-full relative">
			<div className="w-24 max-w-24 border-r flex flex-col items-center py-6 px bg-white">
				<SidebarItem
					icon={<Grid3X3 size={20} />}
					label="Elements"
					active={activeTool === 'elements'}
					onClick={() => handleToolClick('elements')}
					onMouseEnter={() => handleMouseEnter('elements')}
					onMouseLeave={handleMouseLeave}
				/>
				<SidebarItem
					icon={<Grid3X3 size={20} />}
					label="Sections"
					active={activeTool === 'sections'}
					onClick={() => handleToolClick('sections')}
					onMouseEnter={() => handleMouseEnter('sections')}
					onMouseLeave={handleMouseLeave}
				/>
				<SidebarItem
					icon={<PenTool size={20} />}
					label="Design"
					active={activeTool === 'design'}
					onClick={() => handleToolClick('design')}
					onMouseEnter={() => handleMouseEnter('design')}
					onMouseLeave={handleMouseLeave}
				/>
				<SidebarItem
					icon={<MessageSquare size={20} />}
					label="AI Chat"
					active={activeTool === 'ai-chat'}
					onClick={() => handleToolClick('ai-chat')}
					onMouseEnter={() => handleMouseEnter('ai-chat')}
					onMouseLeave={handleMouseLeave}
				/>
			</div>

			<div
				onMouseEnter={() => handleMouseEnter('elements')}
				onMouseLeave={handleMouseLeave}
				className="z-50"
			>
				<ElementToolbar
					isOpen={
						activeTool === 'elements' ||
						(hoveredTool === 'elements' && isHovering) ||
						showElementToolbar
					}
					onClose={handleCloseToolbar}
					onAddElement={handleElementAdd}
					onAddElementAfter={onAddElementAfter}
					onUpdateBlock={onUpdateBlock}
					insertAfterBlockId={insertAfterBlockId}
					replacingBlockId={replacingBlockId}
					initialView={showImageToolbar ? 'images' : 'elements'}
				/>
			</div>
		</div>
	);
}

type SidebarItemProps = {
	icon: React.ReactNode;
	label: string;
	active: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
};

function SidebarItem({
	icon,
	label,
	active,
	onClick,
	onMouseEnter,
	onMouseLeave,
}: SidebarItemProps) {
	return (
		<div
			className={`flex flex-col items-center gap-1 py-3 w-full cursor-pointer
       		 ${active ? 'text-primary' : 'text-muted-foreground'} 
       		 hover:text-primary transition-colors duration-200
			 hover:bg-muted
			 `}
			onMouseDown={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<div className="w-10 h-10 flex items-center justify-center">{icon}</div>
			<span className="text-xs">{label}</span>
		</div>
	);
}
