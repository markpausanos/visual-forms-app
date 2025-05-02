'use server';

import { createServerClient } from '@/lib/utils/supabase';

export async function uploadJsonToStorage(
	json: object,
	flowId: string,
): Promise<string> {
	const supabase = await createServerClient();

	const { data, error } = await supabase.storage
		.from('published-flows')
		.upload(`${flowId}.json`,  JSON.stringify(json), {
			contentType: 'application/json',
			upsert: true,
		});

	if (error) {
		console.error('Error uploading JSON:', error);
		throw new Error('Failed to upload JSON');
	}

	return data.fullPath;
}
