'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, ExternalLink } from 'lucide-react';
import Script from 'next/script';

interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

interface Playlist {
  name: string;
  description: string;
  image: string;
  url: string;
  tracks: number;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const SpotifyWidget = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [player, setPlayer] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Spotify data
  const fetchSpotifyData = async () => {
    // For demo mode, directly use mock data to showcase your music taste
    console.log('Demo mode: Using mock Spotify data');
    
    setCurrentTrack({
      name: 'Valhalla Calling',
      artist: 'Miracle of Sound',
      album: 'Norse Legends',
      image: '/api/placeholder/64/64',
      url: '#',
      isPlaying: false,
      progress: 45000,
      duration: 240000
    });
    
    setPlaylists([
      {
        name: 'ᚱᚢᚾᛁᚲ ᚹᚨᚱᚱᛁᚢᚱᛋ (Runic Warriors)',
        description: 'Epic Norse battle music',
        image: '/api/placeholder/64/64',
        url: '#',
        tracks: 42
      },
      {
        name: 'ᚠᛁᚱᛖ ᚨᚾᛞ ᛁᚲᛖ (Fire and Ice)',
        description: 'Atmospheric Nordic soundscapes',
        image: '/api/placeholder/64/64',
        url: '#',
        tracks: 28
      },
      {
        name: 'ᛗᛁᛞᚷᚨᚱᛞ ᛗᛖᛚᛟᛞᛁᛖᛋ (Midgard Melodies)',
        description: 'Folk-inspired Nordic tunes',
        image: '/api/placeholder/64/64',
        url: '#',
        tracks: 35
      }
    ]);
    

  };

  // Initialize Spotify Web Playback SDK
  const initializePlayer = async () => {
    // For demo purposes, we'll skip actual Spotify player initialization
    // and just show mock data to showcase your music taste
    console.log('Demo mode: Spotify player initialization skipped');
    return;
    
    if (typeof window !== 'undefined' && window.Spotify && isAuthenticated) {
      try {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Norse Portfolio Player',
          getOAuthToken: async (cb: (token: string) => void) => {
            // Get token from your auth endpoint
            try {
              const response = await fetch('/api/spotify/token');
              if (response.ok) {
                const data = await response.json();
                cb(data.access_token);
              }
            } catch (error) {
              console.error('Failed to get OAuth token:', error);
            }
          },
          volume: 0.5
        });

        // Error handling
        spotifyPlayer.addListener('initialization_error', ({ message }: any) => {
          console.error('Failed to initialize:', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }: any) => {
          console.error('Failed to authenticate:', message);
          setIsAuthenticated(false);
        });

        spotifyPlayer.addListener('account_error', ({ message }: any) => {
          console.error('Failed to validate Spotify account:', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }: any) => {
          console.error('Failed to perform playback:', message);
        });

        spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

        spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('player_state_changed', (state: any) => {
          if (state) {
            const track = state.track_window.current_track;
            setCurrentTrack({
              name: track.name,
              artist: track.artists.map((a: any) => a.name).join(', '),
              album: track.album.name,
              image: track.album.images[0]?.url || '',
              url: track.external_urls?.spotify || '',
              isPlaying: !state.paused,
              progress: state.position,
              duration: state.duration
            });
          }
        });

        const success = await spotifyPlayer.connect();
        if (success) {
          console.log('Successfully connected to Spotify!');
          setPlayer(spotifyPlayer);
        }
      } catch (error) {
        console.error('Error initializing Spotify player:', error);
      }
    }
  };

  useEffect(() => {
    // Check if SDK is already loaded
    if (window.Spotify) {
      initializePlayer();
    } else {
      // Load Spotify Web Playback SDK
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        initializePlayer();
      };
    }

    fetchSpotifyData();
    
    // Set up polling for current track updates
    intervalRef.current = setInterval(fetchSpotifyData, 30000); // Update every 30 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initializePlayer();
    }
  }, [isAuthenticated]);









  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentTrack 
    ? (currentTrack.progress / currentTrack.duration) * 100 
    : 0;

  return (
    <>
      <Script 
        src="https://sdk.scdn.co/spotify-player.js" 
        onLoad={() => {
          if (window.Spotify) {
            initializePlayer();
          }
        }}
      />
      
      <div className="fixed bottom-4 left-4 z-50">
        {/* Compact Widget */}
        <div 
          className={`norse-glass rounded-xl p-3 transition-all duration-500 cursor-pointer ${
            isExpanded ? 'w-80' : 'w-16'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
        {!isExpanded ? (
          // Minimized state
          <div className="flex items-center justify-center">
            <Music className="w-6 h-6 text-norse-gold animate-pulse" />
            <span className="ml-1 text-xs text-norse-gold">ᚦ</span>
          </div>
        ) : (
          // Expanded state
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            
              <div>
                {/* Currently Playing */}
                {currentTrack && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-norse-gold" />
                      <span className="text-sm font-medium text-norse-gold">ᚾᛟᚹ ᛈᛚᚨᚤᛁᚾᚷ</span>
                    </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-norse-gold to-norse-fire flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {currentTrack.name}
                    </p>
                    <p className="text-xs text-norse-gold/80 truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                  
                  <a 
                    href={currentTrack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-norse-gold/20 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-norse-gold" />
                  </a>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-norse-shadow rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-norse-gold to-norse-fire h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-norse-gold/60">
                    <span>{formatTime(currentTrack.progress)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button className="p-2 hover:bg-norse-gold/20 rounded-full transition-colors">
                    <Volume2 className="w-4 h-4 text-norse-gold" />
                  </button>
                  <button className="p-2 hover:bg-norse-gold/20 rounded-full transition-colors">
                    {currentTrack.isPlaying ? (
                      <Pause className="w-5 h-5 text-norse-gold" />
                    ) : (
                      <Play className="w-5 h-5 text-norse-gold" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-norse-gold/20 rounded-full transition-colors">
                    <SkipForward className="w-4 h-4 text-norse-gold" />
                  </button>
                    </div>
                  </div>
                )}
                
                {/* Recommended Playlists */}
                <div className="border-t border-norse-gold/20 pt-4">
              <h3 className="text-sm font-medium text-norse-gold mb-3 flex items-center">
                <span className="mr-2">⚔️</span>
                ᚱᛖᚲᛟᛗᛗᛖᚾᛞᛖᛞ ᛈᛚᚨᚤᛚᛁᛋᛏᛋ
              </h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {playlists.map((playlist, index) => (
                  <a
                    key={index}
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-norse-gold/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-norse-fire to-norse-gold flex items-center justify-center flex-shrink-0">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate group-hover:text-norse-gold transition-colors">
                        {playlist.name}
                      </p>
                      <p className="text-xs text-norse-gold/60 truncate">
                        {playlist.tracks} tracks
                      </p>
                    </div>
                    
                    <ExternalLink className="w-3 h-3 text-norse-gold/60 group-hover:text-norse-gold transition-colors flex-shrink-0" />
                  </a>
                ))}
                </div>
              </div>
              </div>
            
            {/* Minimize Button */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="w-full py-2 text-xs text-norse-gold/60 hover:text-norse-gold transition-colors border-t border-norse-gold/20 pt-2"
            >
              ᛗᛁᚾᛁᛗᛁᛉᛖ ᚹᛁᛞᚷᛖᛏ
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default SpotifyWidget;