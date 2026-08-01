// ---------------------------------------------------------------------------
// CancellationGroup — ties AbortControllers to a logical group (a screen,
// a component, a background job) so you can cancel everything in-flight
// for that group at once, e.g. on unmount or navigation.
//
// This deliberately doesn't touch NetworkClient/TransportAdapter — it just
// produces AbortSignals that plug into the existing `signal` field on
// NetworkRequest, so it works with any adapter/decorator combination.
// ---------------------------------------------------------------------------

export class CancellationGroup {
	private groups = new Map<string, Set<AbortController>>();

	/**
	 * Runs fn with a signal scoped to `groupKey`. The controller is
	 * automatically removed from the group once fn settles, so long-lived
	 * groups don't accumulate dead controllers.
	 */
	async run<T>(
		groupKey: string,
		fn: (signal: AbortSignal) => Promise<T>,
	): Promise<T> {
		const controller = new AbortController();
		let set = this.groups.get(groupKey);
		if (!set) {
			set = new Set();
			this.groups.set(groupKey, set);
		}
		set.add(controller);

		try {
			return await fn(controller.signal);
		} finally {
			set.delete(controller);
			if (set.size === 0) this.groups.delete(groupKey);
		}
	}

	/** Abort every in-flight request registered under this group. */
	cancel(groupKey: string): void {
		const set = this.groups.get(groupKey);
		if (!set) return;
		for (const controller of set) controller.abort();
		this.groups.delete(groupKey);
	}

	/** Abort everything, across all groups. */
	cancelAll(): void {
		for (const groupKey of this.groups.keys()) this.cancel(groupKey);
	}

	/** Number of in-flight requests currently tracked for a group. */
	activeCount(groupKey: string): number {
		return this.groups.get(groupKey)?.size ?? 0;
	}
}

// ---------------------------------------------------------------------------
// Usage example
// ---------------------------------------------------------------------------

/*
import { FetchAdapter } from './network-core';
import { RetryAdapter, NetworkClient } from './network-plugins';
import { CacheAdapter } from './network-cache';
import { CancellationGroup } from './network-cancellation';

const base = new FetchAdapter({ baseUrl: 'https://api.example.com' });
const cached = new CacheAdapter(new RetryAdapter(base, { maxAttempts: 3 }), { ttlMs: 15_000 });
const client = new NetworkClient(cached);

const group = new CancellationGroup();

// e.g. inside a dashboard screen's data-loading logic:
async function loadDashboard() {
  const [clients, invoices] = await Promise.all([
    group.run('dashboard', (signal) => client.get('/clients', { signal })),
    group.run('dashboard', (signal) => client.get('/invoices', { signal })),
  ]);
  return { clients: clients.data, invoices: invoices.data };
}

// e.g. on navigating away from the dashboard:
function onLeaveDashboard() {
  group.cancel('dashboard');
}
*/
