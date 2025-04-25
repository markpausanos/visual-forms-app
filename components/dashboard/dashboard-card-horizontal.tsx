import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Ellipsis, Lock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
	title: string;
	subtitle: string;
	author: string;
	image: string;
};

export default function DashboardCardHorizontal({
	title,
	subtitle,
	author,
	image,
}: Props) {
	return (
		<Card className="flex flex-row overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-0">
			<div className="w-40 h-auto shrink-0 relative">
				<Image
					src={image || '/cat.jpeg'}
					alt={title}
					fill
					className="object-cover"
				/>
			</div>

			<div className="flex flex-col flex-1 justify-between">
				<CardTitle className="px-4 pt-4 font-light text-lg">{title}</CardTitle>

				<CardContent className="p-4 pt-2">
					<Badge
						variant="outline"
						className="text-sm text-muted-foreground flex items-center gap-1 mb-1"
					>
						<Lock size={14} />
						{subtitle}
					</Badge>
					<h3 className="font-semibold leading-snug text-base line-clamp-2">
						{title}
					</h3>
				</CardContent>

				<CardFooter className="flex items-center justify-between px-4 pb-4 pt-0 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarFallback>{author}</AvatarFallback>
						</Avatar>
						<span>Erstellt von Ihnen</span>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="p-1 hover:bg-muted rounded">
								<span className="sr-only">Open menu</span>
								<Ellipsis className="h-4 w-4 text-muted-foreground" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</div>
		</Card>
	);
}
