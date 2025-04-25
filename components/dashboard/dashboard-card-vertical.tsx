import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Ellipsis, Lock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '../ui/badge';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type Props = {
	title: string;
	subtitle: string;
	author: string;
	image: string;
};

export default function DashboardCardVertical({
	title,
	subtitle,
	author,
	image,
}: Props) {
	return (
		<Card className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-0">
			<Image
				src={image || '/cat.jpeg'}
				alt={title}
				height={1000}
				width={1000}
				className="h-40 w-full object-cover"
			/>
			<CardTitle className="px-4 pt-4 font-light text-xl">{title}</CardTitle>

			<CardContent className="p-4">
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
						<DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	);
}
