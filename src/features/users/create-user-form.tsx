'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserAction } from './users.actions';

interface CreateUserFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const res = await createUserAction({
			email,
			fullName,
			phoneNumber,
			password,
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
			<h3 className="text-lg font-bold text-white">Add New User</h3>

			{error && (
				<div className="p-2 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded">
					{error}
				</div>
			)}

			<div>
				<Label htmlFor="email">Email address</Label>
				<Input
					id="email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="user@example.com"
				/>
			</div>

			<div>
				<Label htmlFor="fullName">Full Name</Label>
				<Input
					id="fullName"
					type="text"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					placeholder="John Doe"
				/>
			</div>

			<div>
				<Label htmlFor="phoneNumber">Phone Number</Label>
				<Input
					id="phoneNumber"
					type="tel"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder="+15550100"
				/>
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					required
					minLength={8}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={loading}>
					{loading ? 'Creating...' : 'Create User'}
				</Button>
			</div>
		</form>
	);
}
