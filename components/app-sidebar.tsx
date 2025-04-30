import { useState } from 'react';
import { Plus, ArrowUpCircle } from 'lucide-react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from './ui/sidebar';
import Image from 'next/image';

export default function AppSidebar() {
	const [activeTab, setActiveTab] = useState('Forms');

	const navigation = {
		main: [
			{ name: 'Forms', href: '#' },
			{ name: 'Funnels', href: '#' },
		],
		other: [
			{ name: 'Brand Kits', href: '#', hasChildren: true },
			{ name: 'Apps Integrations', href: '#' },
			{ name: 'Template Library', href: '#' },
		],
	};

	return (
		<Sidebar className="flex h-full bg-background">
			<SidebarHeader className="py-4">
				<div className="flex flex-row justify-center items-center w-full ">
					<div className="relative w-36 h-12">
						<Image src={'/logo.svg'} alt="Logo" fill />
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="w-full border-r border-muted flex flex-col">
				{/* Logo and Workspace */}
				<div className="p-4 border-b-2 border-muted">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="workspace" className="border-none">
							<AccordionTrigger className="py-0 hover:no-underline">
								<div className="text-left">
									<div className="font-semibold">Workspace</div>
									<div className="text-muted-foreground text-sm">
										companyname
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="pl-2 py-2">
									<div className="text-sm text-muted-foreground">
										Workspace settings and options would go here
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
				{/* Main Navigation */}
				<div className="py-2">
					<div className="px-4 py-2 text-sm font-medium text-gray-500">
						Main
					</div>
					<nav className="space-y-1">
						{navigation.main.map((item) => (
							<Button
								variant="ghost"
								key={item.name}
								onClick={() => setActiveTab(item.name)}
								// neutralize the ghost hover/bg so it never paints the whole button
								className="relative flex items-center w-full gap-2 bg-transparent hover:bg-transparent"
							>
								{activeTab === item.name && (
									<div className="absolute left-0 top-0 h-full w-1 bg-foreground rounded-r-full" />
								)}

								<div
									className={`flex-1 px-4 py-2 rounded-sm text-left font-semibold ${
										activeTab === item.name
											? 'bg-muted text-foreground'
											: 'text-foreground hover:bg-muted'
									}`}
								>
									{item.name}
								</div>
							</Button>
						))}
					</nav>
				</div>
				{/* Folders Section */}
				<div className="py-2">
					<Separator className="my-2" />
					<div className="px-4 py-2 text-sm font-medium text-muted-foreground">
						Folders
					</div>
					<div className="px-4 py-2">
						<Button
							variant="outline"
							className="w-full justify-start rounded-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Folder
						</Button>
					</div>
				</div>
				{/* Other Navigation */}
				<div className="py-2">
					<Separator className="my-2" />
					<div className="px-4 py-2 text-sm font-medium text-muted-foreground">
						Other
					</div>
					<nav className="space-y-1">
						{navigation.other.map((item) => (
							<div key={item.name}>
								{item.hasChildren ? (
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value={item.name} className="border-none">
											<AccordionTrigger className="relative flex items-center w-full gap-2 px-2 bg-transparent hover:bg-transparent">
												{activeTab === item.name && (
													<div className="absolute left-0 top-0 h-full w-1 bg-foreground rounded-r-full" />
												)}

												<div
													className={`flex-1 px-6 py-2 rounded-sm text-left text-sm font-medium ${
														activeTab === item.name
															? 'bg-muted text-foreground'
															: 'text-foreground hover:bg-muted'
													}`}
												>
													{item.name}
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="pl-8 py-1 text-sm text-muted-foreground">
													Brand kit items would appear here
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								) : (
									<Button
										variant="ghost"
										onClick={() => setActiveTab(item.name)}
										className="relative flex items-center w-full gap-2 bg-transparent hover:bg-transparent"
									>
										{activeTab === item.name && (
											<div className="absolute left-0 top-0 h-full w-1 bg-foreground rounded-r-full" />
										)}
										<div
											className={`flex-1 px-4 py-2 rounded-sm text-left text-sm font-medium ${
												activeTab === item.name
													? 'bg-muted text-foreground'
													: 'text-foreground hover:bg-muted'
											}`}
										>
											{item.name}
										</div>
									</Button>
								)}
							</div>
						))}
					</nav>
				</div>
			</SidebarContent>
			<SidebarFooter className="p-4">
				<div className="bg-foreground text-white p-4 rounded-lg mt-auto">
					<div className="flex items-center mb-2">
						<span className="text-2xl font-bold">100</span>
						<ArrowUpCircle className="ml-2 w-5 h-5" />
					</div>
					<h3 className="text-lg font-medium mb-1">Need more?</h3>
					<p className="text-sm text-gray-300 mb-3">
						Your team has used 200 credits. Need more?
					</p>
					<Button
						variant="link"
						className="text-sm font-medium text-white p-0 h-auto"
					>
						Get more credits
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
