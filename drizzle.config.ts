import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Suppress Neon serverless websocket warnings in Node.js environments
if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}

export default defineConfig({
  schema: './src/db/schema.ts', // Your schema file path
  out: './src/db/drizzle', // Your migrations folder
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
		
  },
});