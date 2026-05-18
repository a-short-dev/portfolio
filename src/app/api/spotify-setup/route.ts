import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/api/spotify-callback";
const SCOPES = "user-read-currently-playing user-read-playback-state";

export async function GET() {
	if (!CLIENT_ID) {
		return NextResponse.json(
			{ error: "SPOTIFY_CLIENT_ID missing in .env" },
			{ status: 500 },
		);
	}

	const params = new URLSearchParams({
		response_type: "code",
		client_id: CLIENT_ID,
		scope: SCOPES,
		redirect_uri: REDIRECT_URI,
	});

	return NextResponse.redirect(
		`https://accounts.spotify.com/authorize?${params.toString()}`,
	);
}
