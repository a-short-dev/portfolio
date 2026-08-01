import { zodValidator } from '@/lib/network/network-validation-zod';
import { spotifyNowPlayingSchema, type SpotifyNowPlaying } from '@/lib/validation';
import type { NetworkClient } from '@/lib/network/network-plugin';

export function createSpotifyService(http: NetworkClient) {
	return {
		getNowPlaying: () =>
			http.get<SpotifyNowPlaying>(
				'/api/spotify/current',
				{ schema: zodValidator(spotifyNowPlayingSchema) },
			),
	};
}

export type SpotifyService = ReturnType<typeof createSpotifyService>;
