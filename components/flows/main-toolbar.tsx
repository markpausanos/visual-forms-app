'use client';

import { useState } from 'react';
import { Grid3X3, PenTool, MessageSquare } from 'lucide-react';
import ElementToolbar from './toolbar-items/element-toolbar';
import { Block } from '../blocks/componentMap';

type ActiveTool = 'elements' | 'sections' | 'design' | 'ai-chat' | null;

export default function MainToolbar({
	onAddElement,
}: {
	onAddElement?: (type: Block) => void;
}) {
	const [activeTool, setActiveTool] = useState<ActiveTool>(null);
	const [hoveredTool, setHoveredTool] = useState<ActiveTool>(null);

	// Handle tool click
	const handleToolClick = (tool: ActiveTool) => {
		if (activeTool === tool) {
			setActiveTool(null); // Toggle off if already active
		} else {
			setActiveTool(tool); // Activate the clicked tool
		}
	};

	// Handle mouse enter
	const handleMouseEnter = (tool: ActiveTool) => {
		if (!activeTool) {
			// Only show preview if no tool is currently active
			setHoveredTool(tool);
		}
	};

	// Handle mouse leave
	const handleMouseLeave = () => {
		if (!activeTool) {
			// Only hide preview if no tool is currently active
			setHoveredTool(null);
		}
	};

	// Determine if toolbar should be shown
	const showElementToolbar =
		activeTool === 'elements' || hoveredTool === 'elements';

	// Handle close of Element Toolbar
	const handleCloseElementToolbar = () => {
		setActiveTool(null);
		setHoveredTool(null);
	};

	return (
		<div className="flex h-full relative">
			<div className="w-24 max-w-24 border-r flex flex-col items-center py-6 px-2 bg-white">
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
			<ElementToolbar
				isOpen={showElementToolbar}
				onClose={handleCloseElementToolbar}
				onAddElement={onAddElement}
			/>
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
			 hover:bg-muted rounded-md px-2
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
