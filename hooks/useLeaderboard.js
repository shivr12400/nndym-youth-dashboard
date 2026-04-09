import { useState, useEffect, useCallback } from 'react';
import { getSessionToken } from '../utils/auth';
import { apiInfo } from '../utils/api';
import { mandirs } from '../utils/mandirs';

export function useLeaderboard(isAuthenticated) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        if (!isAuthenticated) { setIsLoading(false); return; }

        const token = await getSessionToken();
        if (!token) { setIsLoading(false); return; }

        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };

        const results = await Promise.allSettled(
            mandirs.map(async (mandir) => {
                const name = mandir.mandirName;
                const [kidsRes, satsangRes] = await Promise.allSettled([
                    fetch(`${apiInfo.kids_list.get}?mandirName=${encodeURIComponent(name)}`, { headers })
                        .then(r => r.ok ? r.json() : null),
                    fetch(`${apiInfo.kids_attendence.get}?mandirName=${encodeURIComponent(name)}`, { headers })
                        .then(r => r.ok ? r.json() : null),
                ]);

                const kids = kidsRes.status === 'fulfilled' && kidsRes.value
                    ? (kidsRes.value.kids || kidsRes.value.kids_list || kidsRes.value.data || [])
                    : [];

                const satsangRaw = satsangRes.status === 'fulfilled' && satsangRes.value
                    ? (satsangRes.value.data || satsangRes.value.satsangCount || satsangRes.value.satsang_count || [])
                    : [];

                const filtered = Array.isArray(satsangRaw) ? satsangRaw.filter(Boolean) : [];
                const sessionTotals = filtered.map(row =>
                    (Number(row?.numberKidsFirstLevel) || 0) + (Number(row?.numberKidsSecondLevel) || 0) +
                    (Number(row?.numberKidsThirdLevel) || 0) + (Number(row?.numberKidsFourthLevel) || 0)
                ).filter(t => t > 0);
                const sessions = sessionTotals.length;
                const totalKids = sessionTotals.reduce((sum, t) => sum + t, 0);
                const avgKids = sessions > 0 ? Math.round(totalKids / sessions) : 0;

                return { name, registeredKids: kids.length, avgKids, sessions };
            })
        );

        const data = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value)
            .sort((a, b) => b.avgKids - a.avgKids);

        setLeaderboardData(data);
        setIsLoading(false);
    }, [isAuthenticated]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    return { leaderboardData, isLoading };
}
