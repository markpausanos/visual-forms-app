'use server';

import { createServerClient } from '@/lib/utils/supabase';
import { getUser } from './users';

export async function uploadJsonToStorage(
	json: object,
	flowId: string
): Promise<string> {
	const supabase = await createServerClient();

	const { data, error } = await supabase.storage
		.from('published-flows')
		.upload(`${flowId}.json`, JSON.stringify(json), {
			contentType: 'application/json',
			upsert: true,
		});

	if (error) {
		console.error('Error uploading JSON:', error);
		throw new Error('Failed to upload JSON');
	}

	return data.fullPath;
}

export async function uploadImageToStorage(image: File): Promise<string> {
	const supabase = await createServerClient();
	const { user } = await getUser();

	if (!user) {
		throw new Error('User not found');
	}

	const filePath = `${user.id}/${image.name}`;

	// Upload to user-assets bucket in the user's folder
	const { data, error } = await supabase.storage
		.from('user-assets')
		.upload(filePath, image, {
			contentType: image.type,
			upsert: false,
		});

	if (error) {
		console.error('Error uploading image:', error);
		throw new Error('Failed to upload image');
	}

	// Get public URL for the uploaded image
	const { data: urlData } = supabase.storage
		.from('user-assets')
		.getPublicUrl(data.path);

	return urlData.publicUrl;
}

