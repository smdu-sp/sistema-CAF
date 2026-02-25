/** @format */

'use client';

import React from 'react';
import MiniLogo from './mini-logo';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';
import { ArrowLeftFromLineIcon } from 'lucide-react';

export default function ToogleSidebarBtn() {
	const { toggleSidebar } = useSidebar();
	return (
		<SidebarMenuButton
			className='cursor-pointer'
			size='lg'
			onClick={() => toggleSidebar()}>
			<MiniLogo />
			<div className='grid flex-1 text-left text-sm leading-tight'>
				<span className='truncate font-semibold text-xs '>Template 2025</span>
			</div>
			<ArrowLeftFromLineIcon />
		</SidebarMenuButton>
	);
}
