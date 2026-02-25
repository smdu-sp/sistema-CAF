'use client';

import claro from '@/public/martinelli_dia.jpg';
import escuro from '@/public/martinelli_noite.jpeg';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Imagem() {
	const { theme, systemTheme } = useTheme();
	const tema = theme === 'system' ? systemTheme : theme;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="relative hidden bg-muted md:block" />;
	}

	return (
		<div className="relative hidden bg-muted md:block">
			<Image
				width={1200}
				height={1200}
				src={tema === 'dark' ? escuro.src : claro.src}
				alt="Edifício Martinelli"
				className="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	);
}
