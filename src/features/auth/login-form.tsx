'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type LoginFormData, loginFormSchema } from '@/lib/validation';
import { doLoginAction } from './auth.actions';

export default function LoginForm() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const router = useRouter();

	async function onSubmit(data: LoginFormData) {
		const result = await doLoginAction(data);
		if (!result.success) {
			form.setError('root', { message: result.error });
			toast.error(result.error);
		} else {
			toast.success('Successfully logged in!');
			router.push(result.redirectTo);
		}
	}
	return (
		<form
			id="form-rhf-login"
			onSubmit={form.handleSubmit(onSubmit)}
			className="space-y-8"
		>
			<Controller
				name="email"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor="form-rhf-login-email"
							className="capitalize"
						>
							email
						</FieldLabel>
						<Input
							{...field}
							type="email"
							id="form-rhf-login-email"
							aria-invalid={fieldState.invalid}
							placeholder="example@mail.com"
							autoComplete="email"
						/>
						<textarea/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							className="capitalize"
							htmlFor="form-rhf-login-password"
						>
							password
						</FieldLabel>
						<Input
							{...field}
							type="password"
							id="form-rhf-login-password"
							aria-invalid={fieldState.invalid}
							placeholder="**********"
							autoComplete="current-password"
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Field
				orientation="horizontal"
				className="w-full"
			>
				<Button
					type="submit"
					className="w-full"
				>
					Login
				</Button>
			</Field>
		</form>
	);
}
