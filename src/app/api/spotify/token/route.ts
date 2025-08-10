import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    // Check if token is still valid by making a test request
    const testResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (testResponse.ok) {
      return NextResponse.json({ access_token: accessToken });
    }

    // Token expired, try to refresh
    if (refreshToken) {
      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      if (refreshResponse.ok) {
        const tokenData = await refreshResponse.json();
        
        // Update cookies with new tokens
        const response = NextResponse.json({ access_token: tokenData.access_token });
        response.cookies.set('spotify_access_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokenData.expires_in
        });

        if (tokenData.refresh_token) {
          response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
          });
        }

        return response;
      }
    }

    return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
  } catch (error) {
    console.error('Token endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}