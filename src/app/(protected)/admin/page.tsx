import { getUsers } from '@/features/users/users.functions';
import { UsersTable } from '@/features/users/users-table';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminOverviewPage() {
	const currentUser = await getCurrentUser();

	const user = await getUsers();

	return (
		<div className="min-h-screen bg-background p-6 space-y-8">
			<div className="">
				<h1>
					Welcome <span>{currentUser?.name}</span>
				</h1>
			</div>
			<UsersTable
				initialUsers={user.users}
				total={user.total}
			/>
		</div>
	);
}
