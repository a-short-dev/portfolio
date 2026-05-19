import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const BASIC_AUTH = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString("base64");

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken() {
  if (!SPOTIFY_REFRESH_TOKEN) {
    console.error("SPOTIFY_REFRESH_TOKEN is missing");
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // Strict 2s timeout

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
      next: { revalidate: 0 }, // Don't cache token requests
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      const isHtml = text.trim().startsWith("<");
      console.warn(
        `[Spotify] Failed to refresh token (Status: ${response.status}):`,
        isHtml ? "Upstream API server error (HTML)" : text.slice(0, 150),
      );
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[Spotify] Token refresh failed or timed out:", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function GET() {
  try {
    if (!SPOTIFY_REFRESH_TOKEN) {
      return NextResponse.json({ isPlaying: false });
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({ isPlaying: false });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Strict 2s timeout

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 30 }, // Cache play status for 30s
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    if (song.item === null) {
      return NextResponse.json({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists
      .map((_artist: any) => _artist.name)
      .join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;
    const progressMs = song.progress_ms || 0;
    const durationMs = song.item.duration_ms || 0;

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      progressMs,
      durationMs,
    });
  } catch (error) {
    console.warn("Spotify status fetch failed or timed out:", error instanceof Error ? error.message : error);
    return NextResponse.json({ isPlaying: false });
  }
}
