'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserDTO } from '@/lib/auth/types';
import { CreateUserForm } from './create-user-form';
import { EditUserForm } from './edit-user-form';
import { deleteUserAction } from './users.actions';

interface UsersTableProps {
	initialUsers: UserDTO[];
	total: number;
}

export function UsersTable({ initialUsers, total }: UsersTableProps) {
	const [users, setUsers] = useState<UserDTO[]>(initialUsers);
	const [showCreate, setShowCreate] = useState(false);
	const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this user?')) return;

		setDeletingId(id);
		const res = await deleteUserAction(id);
		setDeletingId(null);

		if (res.success) {
			setUsers(users.filter((u) => u.id !== id));
		} else {
			alert(res.error);
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-bold text-white">Users Directory</h2>
					<p className="text-sm text-foreground/60">Manage accounts ({total} total)</p>
				</div>
				{!showCreate && !editingUser && (
					<Button onClick={() => setShowCreate(true)}>+ Add User</Button>
				)}
			</div>

			{showCreate && (
				<CreateUserForm
					onSuccess={() => setShowCreate(false)}
					onCancel={() => setShowCreate(false)}
				/>
			)}

			{editingUser && (
				<EditUserForm
					user={editingUser}
					onSuccess={() => setEditingUser(null)}
					onCancel={() => setEditingUser(null)}
				/>
			)}

			<div className="border border-white/10 rounded-lg overflow-hidden bg-card">
				<table className="w-full text-left text-sm text-foreground/80">
					<thead className="bg-white/5 text-foreground/60 border-b border-white/10">
						<tr>
							<th className="p-3 font-semibold">ID</th>
							<th className="p-3 font-semibold">Name</th>
							<th className="p-3 font-semibold">Email</th>
							<th className="p-3 font-semibold">Roles</th>
							<th className="p-3 font-semibold text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/10">
						{users.length === 0 ? (
							<tr>
								<td colSpan={5} className="p-6 text-center text-foreground/40">
									No users found.
								</td>
							</tr>
						) : (
							users.map((u) => (
								<tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
									<td className="p-3 font-mono text-xs">{u.id}</td>
									<td className="p-3 font-medium text-white">{u.name || '—'}</td>
									<td className="p-3">{u.email}</td>
									<td className="p-3 text-xs">
										{Array.isArray(u.roles) && u.roles.length > 0 ? (
											<span className="inline-flex gap-1">
												{u.roles.map((r: any, idx: number) => (
													<span
														key={idx}
														className="px-2 py-0.5 rounded bg-white/10 text-white"
													>
														{r.roleName || r.name || 'role'}
													</span>
												))}
											</span>
										) : (
											<span className="text-foreground/40">No roles</span>
										)}
									</td>
									<td className="p-3 text-right space-x-2">
										<Button
											variant="outline"
											className="h-8 text-xs px-2"
											onClick={() => setEditingUser(u)}
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											className="h-8 text-xs px-2"
											disabled={deletingId === u.id}
											onClick={() => handleDelete(u.id)}
										>
											{deletingId === u.id ? '...' : 'Delete'}
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
