'use server';

import { Flow } from '@/lib/types/flow';
import { createServerClient } from '@/lib/utils/supabase';

export async function createFlow(
	workspaceId: string,
	userId: string,
	json: object
) {
	const supabase = await createServerClient();

	const { data, error } = await supabase
		.from('flows')
		.insert({
			workspace_id: workspaceId,
			created_by_user_id: userId,
			saved_json: json,
		})
		.select('id')
		.single();

	if (error) {
		console.error('Error inserting flow:', error);
		throw new Error('Failed to create flow');
	}

	return getFlowById(data.id);
}

export async function getFlows(workspaceId: string) {
	const supabase = await createServerClient();

	const { data, error } = await supabase
		.from('flows')
		.select('*')
		.eq('workspace_id', workspaceId);

	if (error) {
		console.error('Error fetching flows:', error);
		throw new Error('Failed to fetch flows');
	}

	return data as Flow[];
}

export async function getFlowById(flowId: string) {
	const supabase = await createServerClient();

	const { data, error } = await supabase
		.from('flows')
		.select('*')
		.eq('id', flowId)
		.single();

	if (error) {
		console.error('Error fetching flow:', error);
		throw new Error('Failed to fetch flow');
	}

	return data as Flow;
}
