'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserDTO } from '@/lib/auth/types';
import { updateUserAction } from './users.actions';

interface EditUserFormProps {
	user: UserDTO;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
	const [email, setEmail] = useState(user.email);
	const [fullName, setFullName] = useState(user.name || '');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const res = await updateUserAction(user.id, {
			email,
			fullName,
			phoneNumber,
			password: password || undefined,
		});

		setLoading(false);

		if (!res.success) {
			setError(res.error);
			return;
		}

		if (onSuccess) onSuccess();
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4 border border-white/10 rounded-lg bg-card">
			<h3 className="text-lg font-bold text-white">Edit User #{user.id}</h3>

			{error && (
				<div className="p-2 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded">
					{error}
				</div>
			)}

			<div>
				<Label htmlFor="edit-email">Email address</Label>
				<Input
					id="edit-email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div>
				<Label htmlFor="edit-fullName">Full Name</Label>
				<Input
					id="edit-fullName"
					type="text"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
			</div>

			<div>
				<Label htmlFor="edit-phoneNumber">Phone Number</Label>
				<Input
					id="edit-phoneNumber"
					type="tel"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder="Leave blank to keep unchanged"
				/>
			</div>

			<div>
				<Label htmlFor="edit-password">New Password (optional)</Label>
				<Input
					id="edit-password"
					type="password"
					minLength={8}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Leave blank to keep current password"
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</form>
	);
}
