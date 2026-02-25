/** @format */

'use client';

import { queryClient } from '@/lib/client-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
