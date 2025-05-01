import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface Props {
	activePage: string;
	setActivePage: (page: string) => void;
}

export default function PageEditToolbar({ activePage, setActivePage }: Props) {
	return (
		<div className="w-64 border-l border-gray-200 bg-white overflow-auto">
			<div className="p-4 border-b border-gray-200">
				<Tabs defaultValue="pages">
					<TabsList className="w-full">
						<TabsTrigger value="edit" className="flex-1">
							Edit
						</TabsTrigger>
						<TabsTrigger value="pages" className="flex-1">
							Pages
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="p-3">
				<PageCard
					title="Start page"
					isActive={activePage === 'start'}
					onClick={() => setActivePage('start')}
				/>
				<PageCard
					title="Range"
					isActive={activePage === 'range'}
					onClick={() => setActivePage('range')}
				/>
				<PageCard
					title="Goal"
					isActive={activePage === 'goal'}
					onClick={() => setActivePage('goal')}
				/>

				<Button
					variant="outline"
					className="w-full mt-4 text-sm flex items-center justify-center gap-2"
				>
					<Plus size={16} />
					Add Page
				</Button>
			</div>
		</div>
	);
}

type PageCardProps = {
	title: string;
	isActive: boolean;
	onClick: () => void;
};

function PageCard({ title, isActive, onClick }: PageCardProps) {
	return (
		<div
			className={`mb-3 p-3 rounded-lg cursor-pointer border ${isActive ? 'border-gray-300' : 'border-transparent'}`}
			onClick={onClick}
		>
			<div className="h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
				<div className="w-16 h-16 bg-gray-200 rounded-md"></div>
			</div>
			<div className="text-sm font-medium">{title}</div>
		</div>
	);
}
