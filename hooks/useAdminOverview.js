import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSessionToken } from '../utils/auth';
import { apiInfo } from '../utils/api';
import { mandirs } from '../utils/mandirs';
import { mapPool, fetchJson } from '../utils/fetchPool';
import {
    buildMandirStats,
    buildNetworkStats,
    buildWeeks,
    normalizeSatsangRecords,
} from '../utils/adminMetrics';

/**
 * Fetches the kids list + satsang history for every active mandir once, then
 * re-derives all metrics client-side whenever the week window changes — the
 * window control must never trigger a refetch.
 */
export function useAdminOverview(isAuthenticated, isAdmin, weekWindow = 12) {
    const [raw, setRaw] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [fetchedAt, setFetchedAt] = useState(null);

    const load = useCallback(async ({ background = false } = {}) => {
        if (!isAuthenticated || !isAdmin) {
            setIsLoading(false);
            return;
        }

        if (background) setIsRefreshing(true);
        else setIsLoading(true);
        setError(null);

        try {
            const token = await getSessionToken();
            if (!token) throw new Error('Session expired. Please log in again.');
            const headers = { Authorization: token, 'Content-Type': 'application/json' };

            // Flat job list so the pool caps TOTAL requests in flight. Firing
            // all 28 at once made the API return HTTP 500 for most of them, and
            // the old `r.ok ? r.json() : null` turned each of those into an
            // empty array — so a mandir that errored was charted as a real zero.
            const jobs = mandirs.flatMap(({ mandirName: name }) => {
                const q = encodeURIComponent(name);
                return [
                    { name, kind: 'kids',    url: `${apiInfo.kids_list.get}?mandirName=${q}` },
                    { name, kind: 'satsang', url: `${apiInfo.kids_attendence.get}?mandirName=${q}` },
                ];
            });

            const settled = await mapPool(jobs, async (job) => {
                try {
                    return { ...job, value: await fetchJson(job.url, { headers }) };
                } catch (err) {
                    console.error(`[AdminOverview] ${job.name}/${job.kind} failed:`, err.message);
                    return { ...job, error: err };
                }
            });

            const byMandir = new Map(
                mandirs.map(m => [m.mandirName, { kids: null, satsang: null, failed: false }])
            );
            for (const result of settled) {
                const entry = byMandir.get(result.name);
                if (result.error) entry.failed = true;
                else entry[result.kind] = result.value;
            }

            const results = [...byMandir].map(([name, entry]) => {
                const kids = entry.kids
                    ? (entry.kids.kids || entry.kids.kids_list || entry.kids.data || [])
                    : [];
                const satsang = entry.satsang
                    ? (entry.satsang.data || entry.satsang.satsangCount || entry.satsang.satsang_count || [])
                    : [];

                return {
                    name,
                    kids: Array.isArray(kids) ? kids.filter(Boolean) : [],
                    records: normalizeSatsangRecords(satsang),
                    failed: entry.failed,
                };
            });

            setRaw(results);
            setFetchedAt(new Date());
        } catch (err) {
            console.error('[AdminOverview] fetch failed:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [isAuthenticated, isAdmin]);

    useEffect(() => { load(); }, [load]);

    const weeks = useMemo(() => buildWeeks(weekWindow), [weekWindow]);

    // A mandir we couldn't load is excluded outright. Charting it as zero
    // would drag down every network average and read as "this mandir reported
    // nobody" — indistinguishable, on screen, from a mandir that really did.
    const failedMandirs = useMemo(
        () => raw.filter(entry => entry.failed).map(entry => entry.name),
        [raw]
    );

    const mandirStats = useMemo(
        () => raw
            .filter(entry => !entry.failed)
            .map(entry => buildMandirStats({
                name: entry.name,
                kids: entry.kids,
                records: entry.records,
                weeks,
            })),
        [raw, weeks]
    );

    const network = useMemo(() => buildNetworkStats(mandirStats, weeks), [mandirStats, weeks]);

    /**
     * Colour slots follow the mandir, not the current filter: the eight
     * busiest mandirs keep their hue for the whole session so a reader who
     * learned "Chicago is blue" stays right when they toggle series off.
     */
    const colorRank = useMemo(() => {
        const ordered = [...mandirStats].sort((a, b) => (b.avgKids - a.avgKids) || a.name.localeCompare(b.name));
        return ordered.reduce((acc, m, i) => { acc[m.name] = i; return acc; }, {});
    }, [mandirStats]);

    return {
        weeks,
        mandirStats,
        failedMandirs,
        network,
        colorRank,
        isLoading,
        isRefreshing,
        error,
        fetchedAt,
        refresh: () => load({ background: true }),
    };
}
