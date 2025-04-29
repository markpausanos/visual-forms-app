import { createServerClient } from '@/lib/utils/supabase';
import { type EmailOtpType } from '@supabase/supabase-js';

import { NextRequest, NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions

export async function GET(request: NextRequest) {
	console.log("NextRequest", request)

	const { searchParams } = new URL(request.url);
	console.log("searchParams", searchParams)
	const token_hash = searchParams.get('token_hash');
	const type = searchParams.get('type') as EmailOtpType | null;
	const next = searchParams.get('next') ?? '/';



	const redirectTo = request.nextUrl.clone();
	redirectTo.pathname = next;

	if (token_hash && type) {
		const supabase = await createServerClient();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});
		if (!error) {
			return NextResponse.redirect(redirectTo);
		}
	}

	// return the user to an error page with some instructions
	redirectTo.pathname = '/auth/auth-code-error';
	return NextResponse.redirect(redirectTo);
}
