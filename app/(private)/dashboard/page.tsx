'use client';

import DashboardCardVertical from '@/components/dashboard/dashboard-card-vertical';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
	Plus,
	LayoutGrid,
	List,
	Import,
	ChevronDown,
	PlusIcon,
} from 'lucide-react';
import { useState } from 'react';
import DashboardCardHorizontal from '@/components/dashboard/dashboard-card-horizontal';

const cards = [
	{
		title: 'Die Bedeutung von Business Präsentationen',
		subtitle: 'Privat',
		author: 'RL',
	},
	{
		title: 'Performance Creatives für deine Marke',
		subtitle: 'Privat',
		author: 'RL',
	},
	{
		title: 'VisualPioneers: Agenturportale, die Zeit Sparen',
		subtitle: 'Privat',
		author: 'RL',
	},
	{
		title: 'Gamma Tips & Tricks',
		subtitle: 'Privat',
		author: 'RL',
	},
];

export default function Page() {
	const [view, setView] = useState<'grid' | 'list'>('grid');

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<Button
						className="rounded-2xl text-background bg-gradient-to-r from-[#001C46] via-[#0047AB] to-[#72C3FC]"
						variant="secondary"
					>
						<Plus className="mr-2 h-4 w-4" />
						Neues erstellen
						<Badge
							className="ml-2 px-2 py-0.5 text-primary"
							variant="secondary"
						>
							AI
						</Badge>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="rounded-2xl border border-primary/25 p-0"
							>
								<div className="w-full h-full flex items-center justify-between gap-2 px-2">
									<div className="flex flex-row items-center gap-1">
										<PlusIcon className="h-4 w-4" />
										<p>Komplett neu</p>
									</div>

									<div className="border-l h-full border-primary/25" />
									<ChevronDown className="h-4 w-4" />
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Leeres Dokument</DropdownMenuItem>
							<DropdownMenuItem>Aus Vorlage</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="rounded-2xl border border-primary/25"
							>
								<Import className="mr-2 h-4 w-4" />
								Importieren
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>PDF</DropdownMenuItem>
							<DropdownMenuItem>PowerPoint</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-2">
					<Button size="icon" variant="ghost" onClick={() => setView('grid')}>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button size="icon" variant="ghost" onClick={() => setView('list')}>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{view === 'grid' && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
					{cards.map((card, idx) => {
						return (
							<DashboardCardVertical
								key={idx}
								title={card.title}
								subtitle={card.subtitle}
								author={card.author}
								image={''}
							/>
						);
					})}
				</div>
			)}

			{view === 'list' && (
				<div className="flex flex-col gap-4">
					{cards.map((card, idx) => {
						return (
							<DashboardCardHorizontal
								key={idx}
								title={card.title}
								subtitle={card.subtitle}
								author={card.author}
								image={''}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
