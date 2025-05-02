'use server';

import { UserLoginSignup } from '@/lib/types';
import { createServerClient } from '@/lib/utils/supabase';
import { User } from '@supabase/auth-js';
import { redirect } from 'next/navigation';

export async function login(user: UserLoginSignup): Promise<{ user: User }> {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: user.password,
	});

	if (error) {
		throw error;
	}

	return await getUser();
}

export async function signup(user: UserLoginSignup): Promise<{ user: User }> {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.signUp({
		email: user.email,
		password: user.password,
	});

	if (error) {
		throw error;
	}

	return await getUser();
}

export async function getUser(): Promise<{ user: User }> {
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

export async function updatePassword(
	password: string
): Promise<{ user: User }> {
	const supabase = await createServerClient();
	const { error } = await supabase.auth.updateUser({
		password,
	});

	if (error) {
		throw error;
	}

	return await getUser();
}
