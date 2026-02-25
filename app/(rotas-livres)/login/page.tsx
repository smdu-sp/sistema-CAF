/** @format */

import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from './_components/login-form';
import Imagem from './_components/imagem';
import { ModeToggle } from '@/components/toggle-theme';
import Background from './_components/background';

export default function Login() {
	return (
		<>
			<Background />
			<div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 z-50 dark:bg-background bg-muted">
				<div className="w-full max-w-sm md:max-w-3xl">
					<div className="flex flex-col gap-6">
						<Card className="overflow-hidden py-0">
							<CardContent className="relative grid p-0 md:grid-cols-2">
								<LoginForm />
								<Imagem />
								<ModeToggle className="z-50 absolute right-2 top-2" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
