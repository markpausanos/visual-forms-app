'use server';

import { createServerClient } from '@/lib/utils/supabase';
import { getUser } from './users';

export async function getUserImages() {
	const supabase = await createServerClient();
	const { user } = await getUser();

	if (!user) {
		throw new Error('User not found');
	}

	// List all files in the user's folder
	const { data, error } = await supabase.storage
		.from('user-assets')
		.list(user.id);

	if (error) {
		console.error('Error retrieving user images:', error);
		throw new Error('Failed to retrieve user images');
	}

	// Filter for image files only (common image extensions)
	const imageFiles = data.filter((file) => {
		const extension = file.name.split('.').pop()?.toLowerCase();
		return (
			extension &&
			['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
		);
	});

	// Get public URLs for all images
	const imageUrls = imageFiles.map((file) => {
		const { data: urlData } = supabase.storage
			.from('user-assets')
			.getPublicUrl(`${user.id}/${file.name}`);

		return {
			name: file.name,
			url: urlData.publicUrl,
			size: file.metadata?.size,
			createdAt: file.created_at,
		};
	});

	return imageUrls;
}

export async function deleteUserImage(imageName: string) {
	const supabase = await createServerClient();
	const { user } = await getUser();

	if (!user) {
		throw new Error('User not found');
	}

	const { error } = await supabase.storage
		.from('user-assets')
		.remove([`${user.id}/${imageName}`]);

	if (error) {
		console.error('Error deleting image:', error);
		throw new Error('Failed to delete image');
	}

	return { success: true };
}
