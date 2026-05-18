import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// We use a dummy URL that the user will configure in their dashboard
const REDIRECT_URI = "https://google.com";

export async function POST(request: Request) {
	try {
		const { code } = await request.json();

		if (!code) {
			return NextResponse.json({ error: "Code is required" }, { status: 400 });
		}

		const authOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
			},
			body: new URLSearchParams({
				code: code,
				redirect_uri: REDIRECT_URI,
				grant_type: "authorization_code",
			}),
		};

		const response = await fetch(
			"https://accounts.spotify.com/api/token",
			authOptions,
		);
		const data = await response.json();

		if (data.error) {
			return NextResponse.json(data, { status: 400 });
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to exchange token" },
			{ status: 500 },
		);
	}
}
