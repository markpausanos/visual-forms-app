'use client';

import DashboardCardVertical from '@/components/dashboard/dashboard-card-vertical';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useState } from 'react';
import DashboardCardHorizontal from '@/components/dashboard/dashboard-card-horizontal';
import ViewModeToggle from '@/components/dashboard/view-mode-toggle';
import { useParams, useRouter } from 'next/navigation';
import { getUser } from '@/actions/users';
import { toast } from 'sonner';
import { createFlow } from '@/actions/flows';

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
	const params = useParams<{ workspaceId: string }>();
	const router = useRouter();

	const [view, setView] = useState<'grid' | 'list'>('grid');

	const handleCreateNewFlow = async () => {
		try {
			const { user } = await getUser();

			if (!user) {
				throw new Error('User not found');
			}
			const flow = {
				workspaceId: params.workspaceId,
				userId: user.id,
				json: [
					{
						id: crypto.randomUUID(),
						name: 'page-1',
						blocks: [
							{
								id: crypto.randomUUID(),
								type: 'Text',
								props: {
									tag: 'h1',
									text: 'Hello World!',
									styles: {
										size: '3xl',
										bold: true,
										align: 'center',
									},
								},
							},
						],
					},
				],
			};

			const createdFlow = await createFlow(
				flow.workspaceId,
				flow.userId,
				flow.json
			);

			if (!createdFlow) {
				throw new Error('Flow creation failed');
			}

			toast.success('Flow created successfully');
			router.replace(`/flows/${createdFlow.id}`);
		} catch {
			toast.error('Error creating new flow');
		}
	};

	return (
		<div className="p-6 space-y-6 w-full">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={handleCreateNewFlow}
						variant="default"
						className="px-4 rounded-xl"
					>
						<Plus className="mr-2 h-4 w-4" />
						Create New
					</Button>
				</div>
				<div className="flex flex-row gap-4">
					<ViewModeToggle value={view} onChange={setView} />
					<Button variant="outline" className="rounded-full px-4 py-2 gap-2">
						<Filter className="w-4 h-4" />
						Filter
					</Button>
				</div>
			</div>

			{view === 'grid' && (
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{cards.map((card, idx) => {
						return (
							<DashboardCardVertical
								key={idx}
								title={card.title}
								type={card.subtitle}
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
