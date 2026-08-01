import { authPlugin, type AuthPluginOptions } from './network-plugin';
import { createHttpClient, type CreateClientOptions } from './http';
import type { NetworkClient } from './network-plugin';

export interface CreateAuthorizedClientOptions extends Omit<CreateClientOptions, 'plugins'> {
	auth: AuthPluginOptions;
}

/**
 * Create a NetworkClient that auto-injects auth credentials via the authPlugin strategy system.
 * Supports: bearer, basic, query param, custom header, or fully custom inject callbacks.
 *
 * @example — API-key as a header for a third-party service:
 * const openai = createAuthorizedClient({
 *   baseUrl: 'https://api.openai.com/v1',
 *   label: 'openai',
 *   auth: { getToken: () => env.OPENAI_API_KEY, strategy: { type: 'header', name: 'Authorization', prefix: 'Bearer ' } },
 * });
 */
export function createAuthorizedClient(options: CreateAuthorizedClientOptions): NetworkClient {
	const { auth, label = 'http-authorized', ...rest } = options;
	return createHttpClient({ ...rest, label, plugins: [authPlugin(auth)] });
}

let _authToken: string | undefined;

export const setAuthToken = (token: string | undefined): void => { _authToken = token; };
export const getAuthToken = (): string | undefined => _authToken;

export const authorizedHttp = createAuthorizedClient({
	label: 'http-authorized',
	auth: { getToken: () => _authToken, strategy: { type: 'bearer' } },
});
