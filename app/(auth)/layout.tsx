export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-svh flex w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">{children}</div>
		</div>
	);
}
