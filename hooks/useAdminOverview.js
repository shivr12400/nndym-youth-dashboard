import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSessionToken } from '../utils/auth';
import { apiInfo } from '../utils/api';
import { mandirs } from '../utils/mandirs';
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

            const results = await Promise.all(
                mandirs.map(async (mandir) => {
                    const name = mandir.mandirName;
                    const q = encodeURIComponent(name);

                    const [kidsRes, satsangRes] = await Promise.allSettled([
                        fetch(`${apiInfo.kids_list.get}?mandirName=${q}`, { headers })
                            .then(r => (r.ok ? r.json() : null)),
                        fetch(`${apiInfo.kids_attendence.get}?mandirName=${q}`, { headers })
                            .then(r => (r.ok ? r.json() : null)),
                    ]);

                    const kidsPayload = kidsRes.status === 'fulfilled' ? kidsRes.value : null;
                    const satsangPayload = satsangRes.status === 'fulfilled' ? satsangRes.value : null;

                    const kids = kidsPayload
                        ? (kidsPayload.kids || kidsPayload.kids_list || kidsPayload.data || [])
                        : [];
                    const satsang = satsangPayload
                        ? (satsangPayload.data || satsangPayload.satsangCount || satsangPayload.satsang_count || [])
                        : [];

                    return {
                        name,
                        kids: Array.isArray(kids) ? kids.filter(Boolean) : [],
                        records: normalizeSatsangRecords(satsang),
                        failed: kidsRes.status !== 'fulfilled' && satsangRes.status !== 'fulfilled',
                    };
                })
            );

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

    const mandirStats = useMemo(
        () => raw.map(entry => buildMandirStats({
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
        network,
        colorRank,
        isLoading,
        isRefreshing,
        error,
        fetchedAt,
        refresh: () => load({ background: true }),
    };
}
