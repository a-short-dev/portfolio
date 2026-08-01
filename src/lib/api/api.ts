import { http } from '@/lib/network/http';
import { createChatService } from './services/chat.service';
import { createContactService } from './services/contact.service';
import { createSpotifyService } from './services/spotify.service';

export const api = {
	contact: createContactService(http),
	spotify: createSpotifyService(http),
	chat: createChatService(http),
} as const;

export type Api = typeof api;
