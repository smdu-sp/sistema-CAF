/** @format */

import {
	Sidebar,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import { ComponentProps } from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

import ToogleSidebarBtn from './toogle-sidebar';

export function AppSidebar({
	props,
}: {
	props?: ComponentProps<typeof Sidebar>;
}) {
	return (
		<Sidebar
			collapsible='icon'
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<ToogleSidebarBtn />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<NavMain />
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
