'use client';

import AppSidebar from '@/components/app-sidebar';

import DashboardHeader from '@/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="flex w-full max-w-full flex-col overflow-x-hidden">
				<DashboardHeader />
				<main className="h-full flex flex-1">{children}</main>
			</div>
		</SidebarProvider>
	);
}
