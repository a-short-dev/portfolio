import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				refetchOnWindowFocus: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	// Check if we are on the server using the native window object
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}

	// On the client, make sure we only create it once
	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}

	return browserQueryClient;
}
