// hooks/useKidsAttendance.js
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { apiInfo } from '../utils/api';
import { mandirs } from '../utils/mandirs';
import { calculateAge, getAgeRange } from '../utils/activities';

const keysToRemove = ["reporter", "kirtanClass", "balMandalClass", "instrumentClass", "satsangClass", "danceClass", "mandirName"];
function removeKeys(jsonArray, keysToRemove) {
    return jsonArray.map(obj => {
        return Object.fromEntries(
            Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
        );
    });
}

export function useKidsAttendance(isAuthenticated) {
    const router = useRouter();
    const { mandirName } = router.query;

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [averageKids, setAverageKids] = useState(0);
    const [tier, setTier] = useState('Bronze');

    const [leaderInfo, setLeaderInfo] = useState({
        mandirName: mandirName,
        leaderName: '',
        leaderEmail: '',
        leaderPhone: ''
    });

    const [upcomingEvents, setUpcomingEvents] = useState({
        mandirName: mandirName,
        date: '',
        upcomingEvents: '',
    });

    const [balMandalClass, setBalMandalClass] = useState(false);
    const [satsangClass, setSatsangClass] = useState(false);
    const [kirtanClass, setKirtanClass] = useState(false);
    const [instrumentClass, setInstrumentClass] = useState(false);
    const [danceClass, setDanceClass] = useState(false);

    const [satsangCount, setSatsangCount] = useState({
        mandirName: mandirName,
        date: '',
        reporter: '',
        numberKidsFirstLevel: 0,
        numberKidsSecondLevel: 0,
        numberKidsThirdLevel: 0,
        numberKidsFourthLevel: 0,
        balMandalClass: balMandalClass,
        satsangClass: satsangClass,
        kirtanClass: kirtanClass,
        instrumentClass: instrumentClass,
        danceClass: danceClass
    });

    const [kidsList, setKidsList] = useState([]);
    const [upcomingAllEvents, setAllUpcomingEvents] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEvents, setOpenEvents] = useState(false);

    const ageDistributionData = useMemo(() => {
        const ranges = [
            { range: '1-8', count: 0 },
            { range: '9-13', count: 0 },
            { range: '14-18', count: 0 },
            { range: '19-25', count: 0 },
        ];
        kidsList.forEach((kid) => {
            const age = calculateAge(kid.birthday);
            const r = getAgeRange(age);
            const entry = ranges.find((x) => x.range === r);
            if (entry) entry.count++;
        });
        return ranges;
    }, [kidsList]);

    const handleChangeBMC = (event) => {
        const { name, checked } = event.target;
        setBalMandalClass(checked);
        setSatsangCount(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeSC = (event) => {
        const { name, checked } = event.target;
        setSatsangClass(checked);
        setSatsangCount(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeKC = (event) => {
        const { name, checked } = event.target;
        setKirtanClass(checked);
        setSatsangCount(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeIC = (event) => {
        const { name, checked } = event.target;
        setInstrumentClass(checked);
        setSatsangCount(prev => ({ ...prev, [name]: checked }));
    };
    const handleChangeDC = (event) => {
        const { name, checked } = event.target;
        setDanceClass(checked);
        setSatsangCount(prev => ({ ...prev, [name]: checked }));
    };

    const fetchData = async () => {
        if (!mandirName) return;
        setIsLoading(true);
        setError(null);
        try {
            const attendanceResponse = await fetch(apiInfo.kids_attendence.get + "?mandirName=" + mandirName);
            if (!attendanceResponse.ok) throw new Error('Failed to fetch attendance data');
            const attendanceData = await attendanceResponse.json();
            const cleanedArray = removeKeys(attendanceData.satsang_count, keysToRemove);
            cleanedArray.sort((a, b) => new Date(a.date) - new Date(b.date));
            setData(cleanedArray);
            setAverageKids(getTrend(cleanedArray));

            const leaderResponse = await fetch(apiInfo.leader_info.get + "?mandirName=" + mandirName);
            if (!leaderResponse.ok) throw new Error('Failed to fetch leader info');
            const leaderData = await leaderResponse.json();
            setLeaderInfo(leaderData);

            const kidsResponse = await fetch(apiInfo.kids_list.get + "?mandirName=" + mandirName);
            if (!kidsResponse.ok) throw new Error('Failed to fetch kids list');
            const kidsListRes = await kidsResponse.json();
            setKidsList(kidsListRes.kids);

            const upcomingEventsResponse = await fetch(apiInfo.upcoming_events.get + "?mandirName=" + mandirName);
            if (!upcomingEventsResponse.ok) throw new Error('Failed to fetch upcoming events');
            const upcomingEventsList = await upcomingEventsResponse.json();
            setAllUpcomingEvents(upcomingEventsList.upcomingEvents);

            const result = mandirs.find(({ mandirName: m }) => m === mandirName);
            if (result) setTier(result.tier);
        } catch (err)
        {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefreshPage = () => {
        fetchData();
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        if (mandirName) {
            fetchData();
        }
    }, [isAuthenticated, router, mandirName]);

    const handleInputChangeLeaderInfo = (e) => {
        const { name, value } = e.target;
        setLeaderInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleInputChangeEvents = (e) => {
        const { name, value } = e.target;
        setUpcomingEvents(prev => ({ ...prev, [name]: value }));
    };

    const handleInputChangeSatsangCount = (e) => {
        const { name, value } = e.target;
        setSatsangCount(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLeaderInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.leader_info.post, {
                method: 'POST',
                body: JSON.stringify(leaderInfo),
            });
            if (!response.ok) {
                throw new Error('Failed to update leader info');
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmitSatsangCount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.kids_attendence.post, {
                method: 'POST',
                body: JSON.stringify(satsangCount),
            });
            if (!response.ok) {
                throw new Error('Failed to submit satsang count');
            }
            setOpen(true)
        } catch (err) {
            setError(err.message)
        }
    };

    const handleAnotherSubmitSatsangCount = () => {
        setOpen(false)
        setBalMandalClass(false)
        setSatsangClass(false)
        setKirtanClass(false)
        setInstrumentClass(false)
        setDanceClass(false)
        setSatsangCount({
            mandirName: mandirName,
            date: '',
            reporter: '',
            numberKids: 0,
            balMandalClass: false,
            satsangClass: false,
            kirtanClass: false,
            instrumentClass: false,
            danceClass: false
        })
    }

    const handleAnotherSubmitEvents = () => {
        setOpenEvents(false)
        setUpcomingEvents({
            date: '',
            upcomingEvents: '',
        })
    }

    const handleSubmitEvents = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiInfo.upcoming_events.post, {
                method: 'POST',
                body: JSON.stringify(upcomingEvents),
            });
            if (!response.ok) {
                throw new Error('Failed to submit event');
            }
            setOpenEvents(true)
        } catch (err) {
            setError(err.message);
        }
    };

    const marks = [
        { value: 0, label: '0' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 30, label: '30' },
        { value: 40, label: '40' },
    ];

    const compareDates = (d1, d2) => {
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime() + 604800000;
        return date1 > date2;
    };

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = mm + '/' + dd + '/' + yyyy;

    let lastDate = ""
    if (data.length > 0) {
        let mostRecentDate = new Date(data[0].date);
        lastDate = data[0].date;
        for (let i = 1; i < data.length; i++) {
            const currentDate = new Date(data[i].date);
            if (currentDate > mostRecentDate) {
                mostRecentDate = currentDate;
                lastDate = data[i].date;
            }
        }
    }

    const getTrend = (kidsData) => {
        var totalKids = 0
        var count = 0
        for (const value of Object.values(kidsData)) {
            for (let v in value) {
                if (Number.isInteger(value[v])) {
                    totalKids += value[v]
                }
            }
            count++
        }
        return Math.round(totalKids / count)
    }

    return {
        mandirName,
        data,
        isLoading,
        error,
        averageKids,
        tier,
        leaderInfo,
        upcomingEvents,
        balMandalClass,
        satsangClass,
        kirtanClass,
        instrumentClass,
        danceClass,
        satsangCount,
        kidsList,
        upcomingAllEvents,
        isEditing,
        open,
        openEvents,
        ageDistributionData,
        marks,
        formattedToday,
        lastDate,
        setLeaderInfo,
        setUpcomingEvents,
        setSatsangCount,
        setIsEditing,
        setOpen,
        setOpenEvents,
        handleChangeBMC,
        handleChangeSC,
        handleChangeKC,
        handleChangeIC,
        handleChangeDC,
        handleInputChangeLeaderInfo,
        handleInputChangeEvents,
        handleInputChangeSatsangCount,
        handleSubmitLeaderInfo,
        handleSubmitSatsangCount,
        handleAnotherSubmitSatsangCount,
        handleAnotherSubmitEvents,
        handleSubmitEvents,
        compareDates,
        handleRefreshPage,
    };
}
