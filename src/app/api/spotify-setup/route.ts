import { NextResponse } from 'next/server';

import { env } from '@/lib/env/env.next';

const CLIENT_ID = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const SCOPES = 'user-read-currently-playing user-read-playback-state';

export async function GET() {
	if (!CLIENT_ID) {
		return NextResponse.json(
			{ error: 'SPOTIFY_CLIENT_ID missing in .env' },
			{ status: 500 },
		);
	}

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: CLIENT_ID,
		scope: SCOPES,
		redirect_uri: REDIRECT_URI,
	});

	return NextResponse.redirect(
		`https://accounts.spotify.com/authorize?${params.toString()}`,
	);
}
