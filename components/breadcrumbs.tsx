/** @format */

'use client';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ChevronRight, House } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
	const pathname = usePathname();
	const segments = pathname === '/' ? [''] : pathname.split('/');

	function composeURL(segments: string[], index: number) {
		const url = segments.slice(0, index + 1).join('/');
		return index > 0 ? url : '/';
	}
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.length > 0 &&
					segments.map((segment, index) => (
						<BreadcrumbItem key={index}>
							{index < segments.length - 1 ? (
								<BreadcrumbLink href={`${composeURL(segments, index)}`}>
									{index === 0 ? <House className='size-4' /> : segment}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>
									{index === 0 ? <House className='size-4' /> : segment}
								</BreadcrumbPage>
							)}
							{index < segments.length - 1 && <ChevronRight size={16} />}
						</BreadcrumbItem>
					))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
