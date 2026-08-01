import { getCurrentUser } from '@/lib/auth';

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await getCurrentUser();
	return <>{children}</>;
}
