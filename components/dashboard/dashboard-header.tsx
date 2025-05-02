import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { SidebarTrigger } from '../ui/sidebar';
import { MessageSquarePlus, Search } from 'lucide-react';
import AvatarDropdown from '../avatar-dropdown';

export default function DashboardHeader() {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
			{/* Sidebar toggle for small screens */}
			<SidebarTrigger className="md:hidden">
				<Separator orientation="horizontal" />
			</SidebarTrigger>

			{/* Main content area */}
			<div className="flex w-full items-center justify-between gap-4">
				{/* Search bar */}
				<div className="flex-1 max-w-sm">
					<Input
						icon={<Search className="w-4 h-4" />}
						type="search"
						placeholder="Search"
						className="rounded-full px-3"
					/>
				</div>

				{/* Right section */}
				<div className="flex items-center gap-4">
					{/* Request Feature Button */}
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-sm font-medium"
					>
						<MessageSquarePlus className="w-4 h-4" />
						Request Feature
					</Button>

					{/* Avatar */}

					<AvatarDropdown />
				</div>
			</div>
		</header>
	);
}
