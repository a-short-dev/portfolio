import { type NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/spotify-callback";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
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

	try {
		const response = await fetch(
			"https://accounts.spotify.com/api/token",
			authOptions,
		);
		const data = await response.json();

		if (data.error) {
			return NextResponse.json(data, { status: 400 });
		}

		return new NextResponse(
			`
      <html>
        <body style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 2rem;">
          <h1>Spotify Refresh Token Generated</h1>
          <p>Copy the following line into your .env file:</p>
          <div style="background: #222; padding: 1rem; border-radius: 4px; word-break: break-all;">
            SPOTIFY_REFRESH_TOKEN=${data.refresh_token}
          </div>
          <p>After updating .env, restart your dev server.</p>
        </body>
      </html>
      `,
			{
				headers: { "Content-Type": "text/html" },
			},
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch token", details: error },
			{ status: 500 },
		);
	}
}
