'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BeatLoader } from 'react-spinners';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { signup } from '@/actions/users';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const signUpSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'At least 8 characters' })
		.regex(/[a-z]/, { message: 'Must include a lowercase letter' })
		.regex(/[A-Z]/, { message: 'Must include an uppercase letter' })
		.regex(/[0-9]/, { message: 'Must include a number' })
		.regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/, {
			message: 'Must include a special character',
		}),
	privacy: z
		.boolean()
		.refine((v) => v, { message: 'You must accept the privacy policy' }),
});

type SignUpData = z.infer<typeof signUpSchema>;

export default function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const router = useRouter();
	const form = useForm<SignUpData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
			privacy: false, // start unchecked
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: SignUpData) => {
		setIsLoading(true);
		try {
			await signup(data);
			toast.success('Email sent to verify your account');
			router.push('/login');
		} catch (err) {
			console.error(err);
			toast.error('Failed to create account. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			{/* Logo */}
			<div className="w-32 h-8 mx-auto flex items-center justify-center">
				<Image
					src="/logo.svg"
					alt="Logo"
					width={113}
					height={24}
					className="object-contain"
				/>
			</div>

			<h1 className="text-center text-3xl font-bold">Create your account</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs">Email</FormLabel>
								<FormControl>
									<Input
										icon={<MailIcon size={16} />}
										placeholder="Enter your email"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xs">Password</FormLabel>
								<FormControl>
									<Input
										icon={<LockIcon size={16} />}
										type="password"
										placeholder="••••••••"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Privacy Policy */}
					<FormField
						control={form.control}
						name="privacy"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-start gap-2">
										<Checkbox
											id="privacy"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<FormLabel
											htmlFor="privacy"
											className="text-xs flex-1 gap-1"
										>
											Agree to the{' '}
											<Link
												href="/terms"
												className="text-primary font-semibold underline"
											>
												Terms of Service
											</Link>{' '}
											and{' '}
											<Link
												href="/privacy"
												className="text-primary font-semibold underline"
											>
												Privacy Policy
											</Link>
											.
										</FormLabel>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{isLoading ? (
							<BeatLoader size={8} color="white" />
						) : (
							'Create Account'
						)}
					</Button>
				</form>
			</Form>

			{/* Divider */}
			<div className="flex items-center justify-center gap-2">
				<div className="h-px w-full bg-muted" />
				<span className="text-sm text-muted-foreground">or</span>
				<div className="h-px w-full bg-muted" />
			</div>

			{/* Google */}
			<Button
				variant="outline"
				className="w-full gap-2"
				onClick={() => (window.location.href = '/api/auth/signin/google')}
			>
				<Image src="/login/google.svg" alt="Google" width={16} height={16} />
				Create account with Google
			</Button>

			{/* Sign in link */}
			<div className="mt-4 text-center text-xs">
				<span className="text-muted-foreground">Already have an account? </span>
				<Link href="/login" className="text-primary font-bold underline">
					Sign in
				</Link>
			</div>
		</div>
	);
}
