import { useState, useEffect, useCallback } from 'react';
import { getSessionToken } from '../utils/auth';
import { apiInfo } from '../utils/api';
import { mandirs } from '../utils/mandirs';
import { mapPool, fetchJson } from '../utils/fetchPool';

function sessionTotal(row) {
    return (Number(row?.numberKidsFirstLevel) || 0) + (Number(row?.numberKidsSecondLevel) || 0) +
           (Number(row?.numberKidsThirdLevel) || 0) + (Number(row?.numberKidsFourthLevel) || 0);
}

export function useLeaderboard(isAuthenticated) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [datesByMandir, setDatesByMandir] = useState({});
    // Mandirs whose data could not be loaded. They are kept OUT of
    // leaderboardData rather than being shown as zeroes, so the board never
    // ranks a mandir on data we don't actually have.
    const [failedMandirs, setFailedMandirs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        if (!isAuthenticated) { setIsLoading(false); return; }

        const token = await getSessionToken();
        if (!token) { setIsLoading(false); return; }

        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };

        // Flat job list so the pool caps TOTAL requests in flight, not requests
        // per mandir — the API 500s when the whole sweep goes out at once.
        const jobs = mandirs.flatMap(({ mandirName: name }) => [
            { name, kind: 'kids',    url: `${apiInfo.kids_list.get}?mandirName=${encodeURIComponent(name)}` },
            { name, kind: 'satsang', url: `${apiInfo.kids_attendence.get}?mandirName=${encodeURIComponent(name)}` },
        ]);

        const settled = await mapPool(jobs, async (job) => {
            try {
                return { ...job, value: await fetchJson(job.url, { headers }) };
            } catch (error) {
                console.error(`[Leaderboard] ${job.name}/${job.kind} failed:`, error.message);
                return { ...job, error };
            }
        });

        const byMandir = new Map(mandirs.map(m => [m.mandirName, { kids: null, satsang: null, failed: false }]));
        for (const result of settled) {
            const entry = byMandir.get(result.name);
            if (result.error) entry.failed = true;
            else entry[result.kind] = result.value;
        }

        const ok = [];
        const failed = [];
        const dates = {};

        for (const [name, entry] of byMandir) {
            if (entry.failed) { failed.push(name); continue; }

            const kids = entry.kids?.kids || entry.kids?.kids_list || entry.kids?.data || [];
            const satsangRaw = entry.satsang?.data || entry.satsang?.satsangCount || entry.satsang?.satsang_count || [];
            const rows = Array.isArray(satsangRaw) ? satsangRaw.filter(Boolean) : [];

            const sessionTotals = rows.map(sessionTotal).filter(t => t > 0);
            const sessions = sessionTotals.length;
            const totalKids = sessionTotals.reduce((sum, t) => sum + t, 0);

            // The dates this mandir has reported. The home page needs its own
            // mandir's set to flag a missing weekend count — exposing it here
            // saves refetching the same endpoint a second time.
            dates[name] = new Set(rows.map(row => row?.date).filter(Boolean));

            ok.push({
                name,
                registeredKids: Array.isArray(kids) ? kids.length : 0,
                avgKids: sessions > 0 ? Math.round(totalKids / sessions) : 0,
                sessions,
            });
        }

        setLeaderboardData(ok.sort((a, b) => b.avgKids - a.avgKids));
        setDatesByMandir(dates);
        setFailedMandirs(failed);
        setIsLoading(false);
    }, [isAuthenticated]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    return { leaderboardData, datesByMandir, failedMandirs, isLoading };
}
