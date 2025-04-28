'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/users';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import Image from 'next/image';

const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' }),
});

export function LoginForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		setIsLoading(true);

		try {
			await login(data);
			router.push('/dashboard');
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('An unknown error occurred');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="w-32 h-8 mx-auto flex items-center justify-center">
				<Image
					src="/logo.svg"
					alt="Logo"
					width={113}
					height={24}
					className="object-contain"
				/>
			</div>

			<h1 className="text-center text-3xl font-bold">Sign In</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Email Field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs">Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your email"
										type="email"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs">Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Enter your password"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Link
						href="/forgot-password"
						className="text-xs font-semibold text-right text-primary underline"
					>
						Forgot password?
					</Link>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Sign In</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
				</form>
			</Form>

			{/* Divider */}
			<div className="flex flex-row items-center justify-center gap-2">
				<div className="h-[1px] w-full bg-muted" />
				<span className="text-sm text-muted-foreground">or</span>
				<div className="h-[1px] w-full bg-muted" />
			</div>

			{/* Google Sign In Button */}
			<Button
				variant="outline"
				className="w-full gap-2"
				onClick={() => {
					window.location.href = '/api/auth/signin/google';
				}}
			>
				<Image src={'/login/google.svg'} alt="Google" width={16} height={16} />
				Sign in with Google
			</Button>

			<div className="mt-4 text-center text-sm">
				<span className="text-muted-foreground">
					Don&apos;t have an account?{' '}
				</span>
				<Link href="/sign-up" className="text-primary font-bold underline">
					Sign up
				</Link>
			</div>
		</div>
	);
}
