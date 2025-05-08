'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	endIcon?: React.ReactNode;
	inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ icon, endIcon, className, inputClassName, type, ...props }, ref) => {
		return (
			<div className={cn('relative', className)}>
				{icon && (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						{icon}
					</div>
				)}
				<input
					className={cn(
						'flex h-10 w-full rounded-lg border border-input bg-sidebar px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						icon && 'pl-10',
						endIcon && 'pr-10',
						inputClassName
					)}
					type={type}
					ref={ref}
					{...props}
				/>
				{endIcon && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						{endIcon}
					</div>
				)}
			</div>
		);
	}
);
Input.displayName = 'Input';

export { Input };
