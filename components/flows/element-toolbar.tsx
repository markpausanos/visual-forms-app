import { Grid3X3, PenTool, MessageSquare } from 'lucide-react';

export default function ElementToolbar() {
	return (
		<div className="w-full max-w-24 border-r flex flex-col items-center py-6 bg-white">
			<SidebarItem
				icon={<Grid3X3 size={20} />}
				label="Elements"
				active={false}
			/>
			<SidebarItem
				icon={<Grid3X3 size={20} />}
				label="Sections"
				active={false}
			/>
			<SidebarItem icon={<PenTool size={20} />} label="Design" active={false} />
			<SidebarItem
				icon={<MessageSquare size={20} />}
				label="AI Chat"
				active={false}
			/>
		</div>
	);
}

type SidebarItemProps = {
	icon: React.ReactNode;
	label: string;
	active: boolean;
};

function SidebarItem({ icon, label, active }: SidebarItemProps) {
	return (
		<div
			className={`flex flex-col items-center gap-1 py-3 w-full ${active ? 'text-blue-600' : 'text-muted-foreground'}`}
		>
			<div className="w-10 h-10 flex items-center justify-center">{icon}</div>
			<span className="text-xs">{label}</span>
		</div>
	);
}
