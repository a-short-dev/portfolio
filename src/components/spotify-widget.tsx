'use client';

import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, ExternalLink } from 'lucide-react';

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

const SpotifyWidget = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recommendedPlaylists] = useState<Playlist[]>([
    {
      name: "⚔️ Code Warrior Anthems",
      description: "Epic orchestral and metal tracks for legendary coding sessions",
      image: "/api/placeholder/150/150",
      url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      tracks: 42
    },
    {
      name: "🔥 Norse Development Saga",
      description: "Viking-inspired music for building digital realms",
      image: "/api/placeholder/150/150",
      url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
      tracks: 38
    },
    {
      name: "⚡ Ragnarok Focus Mode",
      description: "Intense ambient tracks for deep concentration",
      image: "/api/placeholder/150/150",
      url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
      tracks: 55
    }
  ]);

  // Mock current track data (in real implementation, this would connect to Spotify API)
  useEffect(() => {
    const mockTrack: SpotifyTrack = {
      name: "Warriors of Code",
      artist: "Epic Orchestra",
      album: "Digital Valhalla",
      image: "/api/placeholder/80/80",
      url: "https://open.spotify.com/track/example",
      isPlaying: true,
      progress: 125000, // 2:05
      duration: 240000  // 4:00
    };
    setCurrentTrack(mockTrack);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentTrack 
    ? (currentTrack.progress / currentTrack.duration) * 100 
    : 0;

  return (
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
                {recommendedPlaylists.map((playlist, index) => (
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
  );
};

export default SpotifyWidget;