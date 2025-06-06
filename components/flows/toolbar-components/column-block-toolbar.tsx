import { ColumnBlock, ColumnBlockProps } from '@/lib/types/block';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { PanelLeft } from 'lucide-react';

export function ColumnBlockToolbar({
	block,
	onChange,
}: {
	block: ColumnBlock;
	onChange: (id: string, updatedProps: Partial<ColumnBlockProps>) => void;
}) {
	const [padding, setPadding] = useState(block.props.padding || 16);

	// Update state when block props change
	useEffect(() => {
		setPadding(block.props.padding || 16);
	}, [block.props]);

	return (
		<div className="p-3 space-y-6 w-full">
			<h2 className="text-lg font-semibold flex items-center gap-2">
				<PanelLeft size={20} />
				Column
			</h2>

			<div className="space-y-4">
				<div>
					<div className="flex justify-between items-center mb-2">
						<Label className="text-base font-medium">Padding</Label>
						<span className="font-medium">{padding}px</span>
					</div>
					<Slider
						value={[padding]}
						min={0}
						max={40}
						step={4}
						onValueChange={(values) => {
							const value = values[0];
							setPadding(value);
							onChange(block.id, { padding: value });
						}}
					/>
				</div>
			</div>
		</div>
	);
}
