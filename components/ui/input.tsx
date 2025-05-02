import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ icon, endIcon, className, type, ...props }, ref) => {
		return (
			<div className={cn('relative w-full', className)}>
				{icon && (
					<div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pl-3">
						{icon}
					</div>
				)}
				<input
					ref={ref}
					type={type}
					className={cn(
						'flex h-10 w-full rounded-full border border-input bg-muted pl-4 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						icon && 'pl-10',
						endIcon && 'pr-10',
						className
					)}
					{...props}
				/>
				{endIcon && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 border-0">
						{endIcon}
					</div>
				)}
			</div>
		);
	}
);
Input.displayName = 'Input';

export { Input };
