'use client';

import { AppSidebar } from '@/components/app-sidebar';
import AvatarDropdown from '@/components/avatar-dropdown';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { BellDot, Coins, Gem } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<div className="flex flex-1 w-full flex-row items-center justify-end gap-2 md:gap-6">
						<div className="flex flex-row gap-2 items-center">
							<Gem size={20} />
							<p>Erhalten Sie unbegrenzte KI</p>
						</div>
						<div className="flex flex-row gap-2 items-center">
							<Coins size={20} />
							<p>270 Credits</p>
						</div>
						<BellDot size={20} />
						<AvatarDropdown />
					</div>
				</header>
				<main className="h-full flex-1">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
