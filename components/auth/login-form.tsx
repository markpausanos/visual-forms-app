'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { login } from '@/actions/users';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';

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
		<div className="flex flex-col gap-4">
			<h1 className="text-center text-2xl font-bold">
				Welcome to Visual Forms
			</h1>
			<p className="text-muted-foreground text-center text-sm">
				Enter your email below to login to your account
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
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Login</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
				</form>
			</Form>

			<div className="mt-4 text-center text-sm">
				<span className="text-muted-foreground">
					Don&apos;t have an account?{' '}
				</span>
				<Link href="sign-up" className="text-primary font-bold hover:underline">
					Sign up
				</Link>
			</div>
		</div>
	);
}
