import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Link as LinkIcon, Settings } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRandomInt } from '@/lib/utils';
import NextLink from 'next/link';

type Props = {
	id: string;
	title: string;
	type: string;
	image?: string;
	status: 'draft' | 'published';
};

export default function DashboardCardHorizontal({
	id,
	title,
	type,
	image,
	status,
}: Props) {
	const imageUrl = image ?? `/flow-images/image-${getRandomInt(1, 3)}.jpg`;

	return (
		<NextLink href={`/flows/${id}`}>
			<Card className="flex flex-row overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-0">
				{/* Image + overlays */}
				<div className="relative w-40 h-32 shrink-0">
					<Image src={imageUrl} alt={title} fill className="object-cover" />

					{/* Type badge */}
					<div className="absolute top-3 left-3 z-10">
						<Badge className="rounded-full px-2 py-1 text-xs bg-white/70 text-foreground backdrop-blur-sm">
							{type}
						</Badge>
					</div>

					{/* Link / Settings buttons */}
					<div className="absolute top-2 right-2 z-10 flex items-center gap-2">
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-background"
						>
							<LinkIcon className="h-4 w-4 text-muted-foreground" />
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="rounded-full bg-background"
						>
							<Settings className="h-4 w-4 text-muted-foreground" />
						</Button>
					</div>
				</div>

				{/* Main content */}
				<CardContent className="space-y-2 py-4 px-4 flex-1">
					{/* Title + arrow */}
					<div className="flex items-center justify-between">
						<CardTitle className="text-base font-semibold">{title}</CardTitle>
						<ArrowUpRight size={28} className="text-muted-foreground" />
					</div>

					{/* Status badge */}
					<Badge
						variant="outline"
						className={`text-xs px-2 py-0.5 rounded-full w-fit ${
							status === 'draft'
								? 'bg-muted text-muted-foreground'
								: 'bg-emerald-100 text-emerald-700'
						}`}
					>
						● {status === 'draft' ? 'Draft' : 'Published'}
					</Badge>

					{/* Submissions */}
					<div className="text-sm text-muted-foreground">8 Submissions</div>
				</CardContent>
			</Card>
		</NextLink>
	);
}
