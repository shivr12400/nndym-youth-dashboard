/**
 * Concurrency-limited fetching for the "every mandir" pages.
 *
 * The API falls over when the whole network is requested at once. Measured
 * against the production endpoints with 14 mandirs x 2 endpoints = 28 requests:
 *
 *   28 in parallel → 19 failed with HTTP 500
 *   12 in parallel →  7 failed
 *   10 in parallel →  3 failed
 *    8 in parallel →  0 failed
 *   28 sequential  →  0 failed
 *
 * Those failures were being read as empty arrays, so a mandir whose request
 * errored rendered as "0 registered, 0 avg" — data that looks real but isn't,
 * and that changes on every reload as a different subset happens to succeed.
 *
 * Four at a time keeps a wide margin under the observed limit and still
 * finishes the full sweep in well under a second.
 */
export const REQUEST_CONCURRENCY = 4;

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRY_BASE_DELAY_MS = 150;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs `worker` over `items`, never more than `limit` at a time. Results keep
 * the order of the input. `worker` is expected to handle its own errors — a
 * throw aborts the whole sweep.
 */
export async function mapPool(items, worker, limit = REQUEST_CONCURRENCY) {
    const results = new Array(items.length);
    let cursor = 0;

    const runners = Array.from(
        { length: Math.min(limit, items.length) },
        async () => {
            while (cursor < items.length) {
                const index = cursor++;
                results[index] = await worker(items[index], index);
            }
        }
    );

    await Promise.all(runners);
    return results;
}

/**
 * GETs JSON, throwing on any non-2xx rather than resolving to null — the old
 * `r.ok ? r.json() : null` is what let a 500 masquerade as "no data".
 * Transient server errors are retried with jittered backoff so a blip
 * self-heals instead of leaving a mandir silently blank.
 */
export async function fetchJson(url, { headers, retries = 2 } = {}) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) {
            // Jitter so retries don't line back up into another burst.
            await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) + Math.random() * 100);
        }

        let response;
        try {
            response = await fetch(url, { headers });
        } catch (err) {
            lastError = err;   // network-level failure — worth another try
            continue;
        }

        if (response.ok) {
            const text = await response.text();
            try {
                return text ? JSON.parse(text) : null;
            } catch {
                return null;
            }
        }

        lastError = new Error(`HTTP ${response.status}`);
        lastError.status = response.status;

        // 401/403/404 won't get better by asking again.
        if (!RETRYABLE_STATUSES.has(response.status)) break;
    }

    throw lastError;
}
