import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-library-read'
].join(' ');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?spotify_error=' + error, request.url));
  }

  if (!code) {
    // Redirect to Spotify authorization
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('client_id', SPOTIFY_CLIENT_ID);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', SPOTIFY_REDIRECT_URI);
    authUrl.searchParams.set('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.set('show_dialog', 'true');
    
    return NextResponse.redirect(authUrl.toString());
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();
    
    // Store tokens in cookies (in production, use secure storage)
    const response = NextResponse.redirect(new URL('/?spotify_connected=true', request.url));
    response.cookies.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in
    });
    response.cookies.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(new URL('/?spotify_error=auth_failed', request.url));
  }
}