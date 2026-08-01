import 'server-only';
import pino from 'pino';
import { env } from './env/env.next'; // Import your validated environment configuration

declare global {
	interface LoggerNamespace {
		debug?: boolean;
		signature?: string;
	}
	var davinci: LoggerNamespace | undefined;
}

export type LogLevel =
	| 'trace'
	| 'debug'
	| 'info'
	| 'warn'
	| 'error'
	| 'fatal'
	| 'silent';

export type LogType = 'system' | 'audit' | 'security' | 'network';

const isServer = typeof globalThis.window === 'undefined';
const SECURE_PASSPHRASE = 'davinci.fecit.2026';

const DA_VINCI_ART = `
  %c ❖  d a  v i n c i  ❖ %c
  
  +--------------------------+
  |  System Security Active  |
  |    - Anno MMXXVI -       |
  +--------------------------+
  🎨 "fecit" • Handcrafted Masterpiece
`;

let hasTriggeredEasterEgg = false;

const triggerEasterEgg = () => {
	if (isServer || hasTriggeredEasterEgg) return;
	hasTriggeredEasterEgg = true;
	console.log(
		DA_VINCI_ART,
		'color: #ffffff; background: #8b1e0f; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-family: monospace;',
		'color: #d4af37; font-family: monospace; font-weight: 500;',
	);
};

const isDebugEnabled = (): boolean => {
	// Rely on your validated env.ts for server-side logic
	if (isServer) {
		return env.LOG_LEVEL === 'debug' || !!env.DEBUG_MODE;
	}
	try {
		const hasGlobalDebug = globalThis.davinci?.debug === true;
		const hasValidSignature =
			globalThis.davinci?.signature === SECURE_PASSPHRASE;
		if (hasValidSignature) triggerEasterEgg();
		return (
			hasGlobalDebug || hasValidSignature || env.NODE_ENV === 'development'
		);
	} catch {
		return false;
	}
};

// Helper function to safely get level
const getLogLevel = () => {
	// Use the typed 'env' object, no 'process.env' references here
	return env.LOG_LEVEL;
};

const writeLog = (msg: string) => {
	if (typeof process !== 'undefined' && process.stdout && typeof process.stdout.write === 'function') {
		process.stdout.write(msg);
	} else {
		console.log(msg.replace(/\n$/, ''));
	}
};

const devStream = isServer && env.NODE_ENV === 'development'
	? {
			write(msg: string) {
				try {
					const obj = JSON.parse(msg);
					const time = obj.time ? `[${new Date(obj.time).toISOString()}]` : '';
					const levelNum = obj.level ?? 30;
					const labels: Record<number, string> = {
						10: 'TRACE',
						20: 'DEBUG',
						30: 'INFO',
						40: 'WARN',
						50: 'ERROR',
						60: 'FATAL',
					};
					const levelStr = labels[levelNum] || 'INFO';
					
					let levelColor = '\x1b[32m'; // green for info
					if (levelNum === 40) levelColor = '\x1b[33m'; // yellow
					if (levelNum >= 50) levelColor = '\x1b[31m'; // red
					if (levelNum <= 20) levelColor = '\x1b[36m'; // cyan
					
					const reset = '\x1b[0m';
					const typeStr = obj.type ? ` \x1b[90m(${obj.type})\x1b[0m` : '';
					
					const { level, time: t, msg: m, runtime, signature, type, ...rest } = obj;
					const metadata = Object.keys(rest).length > 0 ? ` \x1b[90m${JSON.stringify(rest)}\x1b[0m` : '';
					
					writeLog(`${time}${typeStr} ${levelColor}${levelStr}${reset}: ${m}${metadata}\n`);
				} catch {
					writeLog(msg);
				}
			}
		}
	: undefined;

export const logger = pino(
	{
		level: getLogLevel(),
		timestamp: pino.stdTimeFunctions.isoTime,
		base: {
			runtime: isServer ? 'server' : 'client',
			signature: !isServer
				? globalThis.davinci?.signature || 'standard'
				: undefined,
		},
		browser: {
			asObject: true,
			disabled: !isDebugEnabled() && !isServer,
		},
	},
	devStream,
);

export interface LogContext {
	type?: LogType;
	userId?: string;
	action?: string;
	err?: Error | unknown;
	metadata?: Record<string, unknown>;
	[key: string]: unknown;
}

const formatCtx = (
	type: LogType,
	ctx?: LogContext,
): Record<string, unknown> => ({
	type,
	...(ctx || {}),
});

export interface LogMethod {
	(msg: string, ctx?: LogContext): void;
	(ctx: LogContext, msg?: string): void;
}

export interface CustomLogger {
	trace: LogMethod;
	debug: LogMethod;
	info: LogMethod;
	warn: LogMethod;
	error: LogMethod;
	fatal: LogMethod;
	network: (
		level: Exclude<LogLevel, 'silent'>,
		msg: string,
		ctx?: Omit<LogContext, 'type'> & {
			method?: string;
			url?: string;
			statusCode?: number;
			latencyMs?: number;
		},
	) => void;
	audit: (msg: string, ctx?: Omit<LogContext, 'type'>) => void;
}

const logMessage = (
	level: Exclude<LogLevel, 'silent'>,
	arg1: string | LogContext,
	arg2?: LogContext | string,
	type: LogType = 'system',
) => {
	let msg = '';
	let ctx: LogContext = {};

	if (typeof arg1 === 'string') {
		msg = arg1;
		if (typeof arg2 === 'object') {
			ctx = arg2 || {};
		}
	} else if (typeof arg1 === 'object' && arg1 !== null) {
		ctx = arg1;
		if (typeof arg2 === 'string') {
			msg = arg2;
		}
	}

	logger[level](formatCtx(type, ctx), msg);
};

export const log: CustomLogger = {
	trace: (arg1, arg2?) => logMessage('trace', arg1, arg2),
	debug: (arg1, arg2?) => logMessage('debug', arg1, arg2),
	info: (arg1, arg2?) => logMessage('info', arg1, arg2),
	warn: (arg1, arg2?) => logMessage('warn', arg1, arg2),
	error: (arg1, arg2?) => logMessage('error', arg1, arg2),
	fatal: (arg1, arg2?) => logMessage('fatal', arg1, arg2),

	network: (level, msg, ctx) =>
		logger[level](formatCtx('network', ctx as LogContext), msg),

	audit: (msg, ctx) => log.info(formatCtx('audit', ctx as LogContext), msg),
};
