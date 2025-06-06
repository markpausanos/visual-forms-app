import { ColumnWrapperBlock, ColumnWrapperBlockProps } from '@/lib/types/block';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Grid3X3, Columns } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ColumnWrapperToolbar({
	block,
	onChange,
}: {
	block: ColumnWrapperBlock;
	onChange: (
		id: string,
		updatedProps: Partial<ColumnWrapperBlockProps>
	) => void;
}) {
	const [gap, setGap] = useState(block.props.gap || 16);
	const children = Array.isArray(block.children) ? block.children : [];
	const columnCount = Math.min(children.length, 4);

	// Update state when block props change
	useEffect(() => {
		setGap(block.props.gap || 16);
	}, [block.props]);

	return (
		<div className="p-3 space-y-6 w-full">
			<h2 className="text-lg font-semibold flex items-center gap-2">
				<Grid3X3 size={20} />
				Column Wrapper
			</h2>

			<div className="bg-muted p-3 rounded-md">
				<div className="flex justify-between items-center">
					<Label className="text-sm">Current Layout</Label>
					<Badge variant="outline">{columnCount} Columns</Badge>
				</div>

				<div className="mt-3 grid grid-cols-4 gap-2">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className={`border rounded-md p-2 flex items-center justify-center ${
								i < columnCount
									? 'bg-primary/10 border-primary/30'
									: 'bg-muted-foreground/10'
							}`}
						>
							<Columns
								size={16}
								className={
									i < columnCount ? 'text-primary' : 'text-muted-foreground/30'
								}
							/>
						</div>
					))}
				</div>

				<p className="text-xs text-muted-foreground mt-2">
					The number of columns equals the number of column blocks you add (max
					4)
				</p>
			</div>

			<div className="pt-4 border-t">
				<div className="flex justify-between items-center mb-2">
					<Label className="text-base font-medium">Gap Between Columns</Label>
					<span className="font-medium">{gap}px</span>
				</div>
				<Slider
					value={[gap]}
					min={0}
					max={40}
					step={4}
					onValueChange={(values) => {
						const value = values[0];
						setGap(value);
						onChange(block.id, { gap: value });
					}}
				/>
			</div>
		</div>
	);
}
