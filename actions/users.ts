'use server';

import { UserLoginSignup } from '@/lib/types';
import { createServerClient } from '@/lib/utils/supabase';
import { redirect } from 'next/navigation';

export async function login(user: UserLoginSignup) {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: user.password,
	});

	if (error) {
		throw error;
	}
}

export async function signup(user: UserLoginSignup) {
	const supabase = await createServerClient();
	console.log('user', user);
	const { error } = await supabase.auth.signUp({
		email: user.email,
		password: user.password,
	});

	if (error) {
		throw error;
	}
}

export async function getUser() {
	const supabase = await createServerClient();
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	return data;
}

export async function logout() {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw error;
	}

	redirect('/login');
}
