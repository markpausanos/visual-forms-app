import { getUser } from '@/actions/users';
import { getWorkspaces } from '@/actions/workspace';
import { redirect } from 'next/navigation';

export default async function Page() {
	const { user } = await getUser();

	if (!user) {
		redirect('/login');
	}

	const workspaces = await getWorkspaces();

	redirect(`/workspaces/${workspaces[0].id}/dashboard`);
}
