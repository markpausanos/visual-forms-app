import { Search } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from '@/components/ui/sidebar';

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
	return (
		<form {...props}>
			<SidebarGroup className="py-0">
				<SidebarGroupContent>
					<SidebarInput
						icon={
							<Search
								size={16}
								className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
						}
						id="search"
						placeholder="Search the docs..."
					/>
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}
