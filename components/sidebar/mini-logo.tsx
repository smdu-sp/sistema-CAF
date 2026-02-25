/** @format */

'use client';

import claro from '@/public/smul_icone_azul.png';
import escuro from '@/public/smul_icone_branco.png';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function MiniLogo() {
	const { theme, systemTheme } = useTheme();
	const tema = theme === 'system' ? systemTheme : theme;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className='flex aspect-square size-8 p-1 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground'></div>
		);
	}

	return (
		<div className='flex aspect-square size-8 p-1 items-center justify-center rounded-lg text-sidebar-primary-foreground'>
			<Image
				width={1200}
				height={1200}
				src={tema === 'dark' ? escuro.src : claro.src}
				alt='PMSP'
			/>
		</div>
	);
}
