import { MonitorSmartphone, Smartphone } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
	value: 'mobile' | 'desktop';
	onChange: (value: 'mobile' | 'desktop') => void;
}

export default function PreviewModeToggle({ value, onChange }: Props) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(val) => {
				if (val === 'mobile' || val === 'desktop') onChange(val);
			}}
			className="inline-flex bg-gray-200 rounded-full overflow-hidden"
		>
			<ToggleGroupItem
				value="desktop"
				aria-label="Desktop View"
				className="flex items-center justify-center p-0.5 rounded-full text-muted-foreground hover:bg-white/20"
			>
				<div
					className={`flex items-center justify-center rounded-full p-2 ${
						value === 'desktop'
							? 'bg-background shadow outline outline-gray-200'
							: ''
					}`}
				>
					<MonitorSmartphone className="h-5 w-5" />
				</div>
			</ToggleGroupItem>
			<ToggleGroupItem
				value="mobile"
				aria-label="Mobile View"
				className="flex items-center justify-center p-0.5 rounded-full text-muted-foreground hover:bg-white/20"
			>
				<div
					className={`flex items-center justify-center rounded-full p-2 ${
						value === 'mobile'
							? 'bg-background shadow outline-1 outline-gray-200'
							: ''
					}`}
				>
					<Smartphone className="h-5 w-5" />
				</div>
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
