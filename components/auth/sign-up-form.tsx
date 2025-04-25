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
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { signup } from '@/actions/users';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' })
		.regex(/[a-z]/, { message: 'Password must include a lowercase letter' })
		.regex(/[A-Z]/, { message: 'Password must include an uppercase letter' })
		.regex(/[0-9]/, { message: 'Password must include a number' })
		.regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/, {
			message: 'Password must include a special character',
		}),
});

export function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const router = useRouter();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsLoading(true);

		try {
			await signup(data);

			toast.success('Email sent to verify your account');
			router.push('/login');
		} catch (error) {
			console.error('Error signing up', error);
			toast.error('Failed to create account. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-4', className)} {...props}>
			<h1 className="text-center text-2xl font-bold">Create an account</h1>
			<p className="text-muted-foreground text-center text-sm">
				Enter your information to get started with Visual Forms
			</p>

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
								<FormControl>
									<Input
										icon={<MailIcon size={16} />}
										placeholder="Email"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between"></div>
								<FormControl>
									<Input
										icon={<LockIcon size={16} />}
										type="password"
										placeholder="Password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Create Account</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
				</form>
			</Form>

			<div className="mt-4 text-center text-sm">
				<span className="text-muted-foreground">Already have an account? </span>
				<Link href="/login" className="text-primary font-bold hover:underline">
					Sign in
				</Link>
			</div>
		</div>
	);
}
