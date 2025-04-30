import { Grid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface Props {
	value: 'list' | 'grid';
	onChange: (value: 'list' | 'grid') => void;
}

export default function ViewModeToggle({ value, onChange }: Props) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(val) => {
				if (val === 'grid' || val === 'list') onChange(val);
			}}
			className="inline-flex bg-muted rounded-full overflow-hidden"
		>
			<ToggleGroupItem
				value="grid"
				aria-label="Grid View"
				className="
                flex items-center justify-center
                 p-0.5 rounded-full
                text-muted-foreground
                hover:bg-muted"
			>
				<div
					className={`flex items-center justify-cente rounded-full p-2  ${value === 'grid' ? 'bg-background shadow outline-1 outline-gray-200' : ''}`}
				>
					<Grid className="h-5 w-5" />
				</div>
			</ToggleGroupItem>

			<ToggleGroupItem
				value="list"
				aria-label="List View"
				className="
                flex items-center justify-center
                p-0.5 rounded-full
                text-muted-foreground
                hover:bg-muted"
			>
				<div
					className={`flex items-center justify-cente rounded-full p-2 ${value === 'list' ? 'bg-background shadow outline-1 outline-gray-200' : ''}`}
				>
					<List className="h-5 w-5" />
				</div>
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
