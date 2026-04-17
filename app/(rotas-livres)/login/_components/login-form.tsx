/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Logo from './logo';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
	login: z
		.string()
		.min(7, {
			message: 'Login tem de ter 7 caracteres.',
		})
		.max(7, {
			message: 'Login tem de ter 7 caracteres.',
		}),
	senha: z.string().min(2, {
		message: 'Campo senha não pode ser vazio.',
	}),
});

export function LoginForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			senha: '',
		},
	});

	async function onSubmit({ login, senha }: z.infer<typeof formSchema>) {
		try {
			const resp = await signIn('credentials', { login, senha, redirect: false });
			// No NextAuth v5 beta, ok:true pode indicar apenas HTTP 200, não sucesso de auth.
			// A forma confiável de detectar falha é checar resp?.error.
			if (resp?.error) {
				const msg =
					resp.error === 'CredentialsSignin'
						? 'Login ou senha inválidos.'
						: 'Não foi possível realizar o login.';
				toast.error(msg);
				return;
			}
			toast.success('Login realizado com sucesso.');
			router.refresh();
			router.push('/home');
		} catch (e) {
			toast.error('Não foi possível realizar o login.');
		}
	}

	return (
		<Form {...form}>
			<form
				className="p-6 md:p-8 dark:bg-muted bg-background"
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center text-center">
						<Logo />
					</div>
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="login"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Login</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="dark:bg-background bg-muted"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="senha"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											className="dark:bg-background bg-muted"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={form.formState.isSubmitting || form.formState.isLoading}
						type="submit"
						className="w-full disabled:opacity-50">
						{form.formState.isSubmitting || form.formState.isLoading ? (
							<>
								Entrar <Loader2 className="animate-spin" />
							</>
						) : (
							'Entrar'
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
