import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

async function makeSpotifyRequest(url: string, accessToken: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (response.status === 401) {
    throw new Error('Token expired');
  }

  return response;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('spotify_access_token')?.value;
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Try to get current playing track
    let currentTrackResponse;
    try {
      if (!accessToken) {
        throw new Error('No access token available');
      }
      currentTrackResponse = await makeSpotifyRequest(
        'https://api.spotify.com/v1/me/player/currently-playing',
        accessToken
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Token expired' && refreshToken) {
        // Refresh token and retry
        const newTokens = await refreshAccessToken(refreshToken);
        accessToken = newTokens.access_token;
        
        // Retry the request with new token
        if (!accessToken) {
          throw new Error('Failed to refresh access token');
        }
        currentTrackResponse = await makeSpotifyRequest(
          'https://api.spotify.com/v1/me/player/currently-playing',
          accessToken
        );
      } else {
        throw error;
      }
    }

    let currentTrack = null;
    if (currentTrackResponse.ok && currentTrackResponse.status !== 204) {
      const trackData = await currentTrackResponse.json();
      if (trackData && trackData.item) {
        currentTrack = {
          name: trackData.item.name,
          artist: trackData.item.artists.map((a: any) => a.name).join(', '),
          album: trackData.item.album.name,
          image: trackData.item.album.images[0]?.url || '',
          url: trackData.item.external_urls.spotify,
          isPlaying: trackData.is_playing,
          progress: trackData.progress_ms,
          duration: trackData.item.duration_ms
        };
      }
    }

    // Get user's playlists
    let playlistsResponse;
    try {
      if (!accessToken) {
        throw new Error('No access token available for playlists');
      }
      playlistsResponse = await makeSpotifyRequest(
        'https://api.spotify.com/v1/me/playlists?limit=10',
        accessToken
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Token expired' && refreshToken) {
        // Refresh token and retry
        const newTokens = await refreshAccessToken(refreshToken);
        accessToken = newTokens.access_token;
        
        if (!accessToken) {
          throw new Error('Failed to refresh access token for playlists');
        }
        playlistsResponse = await makeSpotifyRequest(
          'https://api.spotify.com/v1/me/playlists?limit=10',
          accessToken
        );
      } else {
        throw error;
      }
    }

    let playlists = [];
    if (playlistsResponse.ok) {
      const playlistData = await playlistsResponse.json();
      playlists = playlistData.items.map((playlist: any) => ({
        name: playlist.name,
        description: playlist.description || '',
        image: playlist.images[0]?.url || '',
        url: playlist.external_urls.spotify,
        tracks: playlist.tracks.total
      }));
    }

    const response = NextResponse.json({
      currentTrack,
      playlists
    });

    // Update access token cookie if refreshed
    if (accessToken !== cookieStore.get('spotify_access_token')?.value) {
      response.cookies.set('spotify_access_token', accessToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1 hour
      });
    }

    return response;
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Spotify data' }, { status: 500 });
  }
}