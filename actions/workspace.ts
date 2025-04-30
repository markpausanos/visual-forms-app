'use server';

import { WorkspaceCreate } from '@/lib/types/workspace';
import { createServerClient } from '@/lib/utils/supabase';
import { Workspace } from '../lib/types/workspace';

export async function createWorkspace(workspace: WorkspaceCreate) {
	const supabase = await createServerClient();

	const { data, error } = await supabase
		.from('workspaces')
		.insert({
			name: workspace.name,
			created_by_user_id: workspace.user_id,
		})
		.select()
		.single();

	if (error) {
		throw error;
	}

	await addMemberToWorkspace(data.id, workspace.user_id, 'owner');

	return data as Workspace;
}

export async function addMemberToWorkspace(
	workspaceId: string,
	userId: string,
	role: string
) {
	const supabase = await createServerClient();
	const { data, error } = await supabase
		.from('workspace_memberships')
		.insert({
			workspace_id: workspaceId,
			user_id: userId,
			role,
		})
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}

export async function getWorkspaces() {
	const supabase = await createServerClient();
	const { data, error } = await supabase.from('workspaces').select('*');
	if (error) {
		throw error;
	}

	return data as Workspace[];
}
