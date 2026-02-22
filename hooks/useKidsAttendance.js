import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { apiInfo } from '../utils/api';
import { getSessionToken } from '../utils/auth';
import { calculateAge } from '../utils/activities';

function getKidAge(k) {
    const ageVal = k.age ?? k.Age;
    const ageNum = parseInt(ageVal, 10);
    if (!isNaN(ageNum)) return ageNum;
    return calculateAge(k.birthday ?? k.Birthday);
}

function isMale(g) {
    const s = String(g || '').toLowerCase();
    return s === 'm' || s === 'male';
}

function isFemale(g) {
    const s = String(g || '').toLowerCase();
    return s === 'f' || s === 'female';
}

function computeGenderDistribution(kids = []) {
    const male   = kids.filter(k => isMale(k.gender ?? k.Gender)).length;
    const female = kids.filter(k => isFemale(k.gender ?? k.Gender)).length;
    const other  = kids.length - male - female;
    return [
        { name: 'Male',              value: male },
        { name: 'Female',            value: female },
        { name: 'Other/Unspecified', value: other },
    ];
}

function computeAgeDistribution(kids = []) {
    const buckets = { '0-5': 0, '6-10': 0, '11-14': 0, '15-17': 0, '18+': 0 };
    kids.forEach(k => {
        const age = getKidAge(k);
        if (age <= 0)         return;
        if (age <= 5)          buckets['0-5']++;
        else if (age <= 10)    buckets['6-10']++;
        else if (age <= 14)    buckets['11-14']++;
        else if (age <= 17)    buckets['15-17']++;
        else                   buckets['18+']++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
}

function computeGenderByAgeGroup(kids = []) {
    const result = { '1-8': [], '9-13': [], '14-18': [], '19-25': [] };
    for (const range of ['1-8', '9-13', '14-18', '19-25']) {
        const [lo, hi] = range.split('-').map(Number);
        const inGroup = kids.filter(k => {
            const age = getKidAge(k);
            if (age <= 0) return false;
            if (range === '19-25') return age >= 19 && age <= 25;
            return age >= lo && age <= hi;
        });
        const male = inGroup.filter(k => isMale(k.gender ?? k.Gender)).length;
        const female = inGroup.filter(k => isFemale(k.gender ?? k.Gender)).length;
        result[range] = [
            { name: 'Male', value: male },
            { name: 'Female', value: female },
        ];
    }
    return result;
}

function computeTier(count) {
    if (count >= 30) return 'Gold';
    if (count >= 15) return 'Silver';
    return 'Bronze';
}

const DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

const EMPTY_EVENT_FORM = { date: '', upcomingEvents: '' };

const INITIAL_SATSANG = {
    mandirName: '',
    reporter: '',
    date: '',
    numberKidsFirstLevel: 0,
    numberKidsSecondLevel: 0,
    numberKidsThirdLevel: 0,
    numberKidsFourthLevel: 0,
    balMandalClass: false,
    satsangClass: false,
    kirtanClass: false,
    instrumentClass: false,
    danceClass: false,
};

export function useKidsAttendance(isAuthenticated) {
    const router = useRouter();
    const { mandirName } = router.query;

    const [data, setData]               = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState(null);
    const [kidsOverTimeData, setKidsOverTimeData] = useState([]);

    // Leader info
    const [leaderInfo, setLeaderInfo]   = useState({
        mandirName: mandirName || '',
        leaderName: '', leaderEmail: '', leaderPhone: ''
    });

    const [upcomingEvents, setUpcomingEvents]         = useState([]);
    const [upcomingAllEvents, setUpcomingAllEvents]   = useState([]);
    const [eventForm, setEventForm]                   = useState(EMPTY_EVENT_FORM);
    const [eventsDateError, setEventsDateError]       = useState('');
    const [openEvents, setOpenEvents]                 = useState(false);

    // Goals
    const [goals, setGoals]                     = useState({ goal1: '', goal2: '', goal3: '' });
    const [openGoalsSnackbar, setOpenGoalsSnackbar] = useState(false);

    const [satsangCount, setSatsangCount]           = useState(INITIAL_SATSANG);
    const [openSatsangSuccess, setOpenSatsangSuccess] = useState(false);
    const [satsangDateError, setSatsangDateError]   = useState('');

    // UI
    const [isEditing, setIsEditing]     = useState(false);

    const authFetch = useCallback(async (url, options = {}) => {
        const currentToken = await getSessionToken();
        if (!currentToken) throw new Error("No token available for request");

        const headers = {
            ...options.headers,
            'Authorization': currentToken,   // Raw JWT — no "Bearer " prefix for Cognito authorizer
            'Content-Type': 'application/json'
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            throw new Error("Session expired. Please log in again.");
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }
        return response.json();
    }, []);

    const fetchData = useCallback(async () => {
        const currentToken = await getSessionToken();
        console.log('[Fetch] Gate check:', { isAuthenticated, mandirName, hasToken: !!currentToken });

        if (isAuthenticated && !currentToken) {
            console.warn("Session expired in the background. Redirecting to login.");
            router.push('/login');
            return;
        }

        if (!isAuthenticated || !mandirName || !currentToken) {
            console.log("Fetch postponed: Missing", {
                auth: isAuthenticated, mandir: !!mandirName, token: !!currentToken
            });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [kidsRes, leaderRes, goalsRes] = await Promise.all([
                authFetch(`${apiInfo.kids_list.get}?mandirName=${mandirName}`),
                authFetch(`${apiInfo.leader_info.get}?mandirName=${mandirName}`),
                authFetch(`${apiInfo.goals.get}?mandirName=${mandirName}`),
            ]);

            if (kidsRes)    setData(kidsRes.kids || kidsRes.kids_list || kidsRes.data || []);
            if (leaderRes)  setLeaderInfo(leaderRes);
            if (goalsRes)   setGoals(goalsRes);

            try {
                const eventsRes = await authFetch(
                    `${apiInfo.upcoming_events.get}?mandirName=${mandirName}`
                );
                setUpcomingEvents(eventsRes?.upcomingEvents || []);
                setUpcomingAllEvents(eventsRes?.allEvents   || eventsRes?.upcomingEvents || []);
            } catch (eventsErr) {
                console.error('[Fetch] upcomingEvents error (non-fatal):', eventsErr.message);
                setUpcomingEvents([]);
            }

            try {
                const overTimeRes = await authFetch(
                    `${apiInfo.kids_attendence?.get}?mandirName=${mandirName}`
                );
                const rawSatsang = overTimeRes?.data || overTimeRes?.satsangCount || overTimeRes?.satsang_count || [];
                const withTotal = Array.isArray(rawSatsang)
                    ? rawSatsang.filter(Boolean).map((row) => ({
                        ...row,
                        totalKids: (row?.numberKidsFirstLevel || 0) + (row?.numberKidsSecondLevel || 0) +
                            (row?.numberKidsThirdLevel || 0) + (row?.numberKidsFourthLevel || 0),
                    }))
                    : [];
                setKidsOverTimeData(withTotal);
            } catch (overTimeErr) {
                console.error('[Fetch] satsangCount/kidsOverTime error (non-fatal):', overTimeErr.message);
                setKidsOverTimeData([]);
            }

        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, mandirName, authFetch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const kidsList = useMemo(() => data, [data]);

    const averageKids = useMemo(() => {
        if (!kidsOverTimeData.length) return data.length;
        const total = kidsOverTimeData.reduce((sum, entry) => sum + (entry.totalKids || 0), 0);
        return Math.round(total / kidsOverTimeData.length);
    }, [kidsOverTimeData, data]);

    const tier = useMemo(() => computeTier(averageKids), [averageKids]);

    const genderDistributionData = useMemo(() => computeGenderDistribution(data), [data]);
    const ageDistributionData    = useMemo(() => computeAgeDistribution(data),    [data]);
    const genderDistributionDataByAgeGroup = useMemo(() => computeGenderByAgeGroup(data), [data]);

    // ── Leader info handlers ───────────────────────────────────────────────
    const handleInputChangeLeaderInfo = useCallback((e) => {
        const { name, value } = e.target;
        setLeaderInfo(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmitLeaderInfo = useCallback(async () => {
        try {
            await authFetch(apiInfo.leader_info.post, {
                method: 'POST',
                body: JSON.stringify(leaderInfo),
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save leader info:', err);
        }
    }, [authFetch, leaderInfo]);

    const handleInputChangeGoals = useCallback((e) => {
        const { name, value } = e.target;
        setGoals(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmitGoals = useCallback(async () => {
        try {
            await authFetch(apiInfo.goals.post, {
                method: 'POST',
                body: JSON.stringify({ ...goals, mandirName }),
            });
            setOpenGoalsSnackbar(true);
        } catch (err) {
            console.error('Failed to save goals:', err);
        }
    }, [authFetch, goals, mandirName]);

    // ── Events form handlers ───────────────────────────────────────────────
    const handleInputChangeEvents = useCallback((e) => {
        const { name, value } = e.target;
        setEventForm(prev => ({ ...prev, [name]: value }));
        if (name === 'date') setEventsDateError('');
    }, []);

    const handleEventsDateBlur = useCallback(() => {
        if (eventForm.date && !DATE_REGEX.test(eventForm.date)) {
            setEventsDateError('Please use MM/DD/YYYY format');
        } else {
            setEventsDateError('');
        }
    }, [eventForm.date]);

    const handleSubmitEvents = useCallback(async (e) => {
        e?.preventDefault();
        if (!DATE_REGEX.test(eventForm.date)) {
            setEventsDateError('Please use MM/DD/YYYY format');
            return;
        }
        try {
            await authFetch(apiInfo.upcoming_events.post, {
                method: 'POST',
                body: JSON.stringify({ ...eventForm, mandirName }),
            });
            setOpenEvents(true);
            setEventForm(EMPTY_EVENT_FORM);
            setUpcomingEvents(prev => [...prev, { ...eventForm, id: Date.now() }]);
        } catch (err) {
            console.error('Failed to submit event:', err);
        }
    }, [authFetch, eventForm, mandirName]);

    const handleAnotherSubmitEvents = useCallback(() => {
        setOpenEvents(false);
        setEventForm(EMPTY_EVENT_FORM);
    }, []);

    const handleRefreshPage = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChangeSatsangCount = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setSatsangCount(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (name === 'date') setSatsangDateError('');
    }, []);

    const handleSubmitSatsangCount = useCallback(async (e) => {
        e?.preventDefault();
        if (!DATE_REGEX.test(satsangCount.date)) {
            setSatsangDateError('Please use MM/DD/YYYY format');
            return;
        }
        try {
            await authFetch(apiInfo.kids_attendence.post, {
                method: 'POST',
                body: JSON.stringify(satsangCount),
            });
            setOpenSatsangSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    }, [authFetch, satsangCount]);

    const handleAnotherSubmitSatsangCount = useCallback(() => {
        setSatsangCount(INITIAL_SATSANG);
        setOpenSatsangSuccess(false);
        setSatsangDateError('');
    }, []);

    const handleChangeBMC = useCallback((e) => setSatsangCount(prev => ({ ...prev, balMandalClass: e.target.checked })), []);
    const handleChangeSC = useCallback((e) => setSatsangCount(prev => ({ ...prev, satsangClass: e.target.checked })), []);
    const handleChangeKC = useCallback((e) => setSatsangCount(prev => ({ ...prev, kirtanClass: e.target.checked })), []);
    const handleChangeIC = useCallback((e) => setSatsangCount(prev => ({ ...prev, instrumentClass: e.target.checked })), []);
    const handleChangeDC = useCallback((e) => setSatsangCount(prev => ({ ...prev, danceClass: e.target.checked })), []);

    return {
        mandirName,
        data,
        isLoading,
        error,
        kidsList,
        leaderInfo,
        upcomingEvents,       // array — for the events table
        upcomingAllEvents,
        eventForm,
        goals,
        kidsOverTimeData,

        averageKids,
        tier,
        genderDistributionData,
        ageDistributionData,
        genderDistributionDataByAgeGroup,

        // UI state
        openGoalsSnackbar,
        isEditing,
        openEvents,
        eventsDateError,

        setIsEditing,
        setLeaderInfo,
        setUpcomingEvents,
        setGoals,

        // Handlers
        handleCloseGoalsSnackbar: () => setOpenGoalsSnackbar(false),
        handleInputChangeLeaderInfo,
        handleSubmitLeaderInfo,
        handleInputChangeGoals,
        handleSubmitGoals,
        handleInputChangeEvents,
        handleEventsDateBlur,
        handleSubmitEvents,
        handleAnotherSubmitEvents,
        handleRefreshPage,
        fetchData,

        satsangCount,
        handleInputChangeSatsangCount,
        handleSubmitSatsangCount,
        handleAnotherSubmitSatsangCount,
        handleChangeBMC,
        handleChangeSC,
        handleChangeKC,
        handleChangeIC,
        handleChangeDC,
        balMandalClass: satsangCount?.balMandalClass ?? false,
        satsangClass: satsangCount?.satsangClass ?? false,
        kirtanClass: satsangCount?.kirtanClass ?? false,
        instrumentClass: satsangCount?.instrumentClass ?? false,
        danceClass: satsangCount?.danceClass ?? false,
        open: openSatsangSuccess,
        dateError: satsangDateError,
    };
}