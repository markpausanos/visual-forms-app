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

export async function uploadImageToStorage(
	image: File,
	flowId: string
): Promise<string> {
	const supabase = await createServerClient();
	const { user } = await getUser();

	if (!user) {
		throw new Error('User not found');
	}

	// Generate unique filename
	const fileExt = image.name.split('.').pop();
	const fileName = `${flowId}_${Date.now()}.${fileExt}`;
	const filePath = `${user.id}/${fileName}`;

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

export async function getImageUploadUrl(
	fileName: string,
	contentType: string,
	flowId: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
	const supabase = await createServerClient();
	const { user } = await getUser();

	if (!user) throw new Error('User not found');

	const path = `${user.id}/${flowId}_${Date.now()}_${fileName}`;

	const { data, error } = await supabase.storage
		.from('user-assets')
		.createSignedUploadUrl(path);

	if (error) throw new Error('Failed to create upload URL');

	return {
		uploadUrl: data.signedUrl,
		fileUrl: supabase.storage.from('user-assets').getPublicUrl(path).data
			.publicUrl,
	};
}
