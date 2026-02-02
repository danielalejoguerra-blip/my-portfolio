export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			{children}
		</div>
	);
}
