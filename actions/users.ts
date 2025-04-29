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

export async function resetPassword(email: string) {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.resetPasswordForEmail(email);

	if (error) {
		throw error;
	}
}

export async function updatePassword(password: string) {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.updateUser({
		password,
	});

	if (error) {
		throw error;
	}
}
