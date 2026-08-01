import React, { useRef, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import LeaderContactSection from '../components/kids-attendance/LeaderContactSection';
import AgeDistributionChart from '../components/kids-attendance/AgeDistributionChart';
import AttendanceCharts from '../components/kids-attendance/AttendanceCharts';
import UpcomingEvents from '../components/kids-attendance/UpcomingEvents';
import KidsListTable from '../components/kids-attendance/KidsListTable';
import GenderDistributionChart from '../components/kids-attendance/GenderDistributionChart';
import KidsOverTimeChart from '../components/kids-attendance/KidsOverTimeChart';
import { activities } from '../utils/activities';
import Icon from '../components/common/Icon';

const TIERS = [
    { label: 'Standard', min: 0 },
    { label: 'Bronze',   min: 30 },
    { label: 'Silver',   min: 35 },
    { label: 'Gold',     min: 50 },
];
const MAX_TRACK = 55;

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } } };

function TierTrack({ averageKids }) {
    const pct = Math.min((averageKids / MAX_TRACK) * 100, 100);
    const currentIdx = TIERS.reduce((acc, t, i) => (averageKids >= t.min ? i : acc), 0);
    const next = TIERS[currentIdx + 1];
    const needed = next ? Math.max(0, next.min - averageKids) : 0;

    return (
        <div className="yd-tier">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'oklch(1 0 0 / 0.55)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Tier Progress
                </span>
                <span style={{ fontSize: '0.75rem', color: 'oklch(1 0 0 / 0.55)' }}>
                    {next ? (needed > 0 ? `${needed} more to ${next.label}` : `${next.label} reached!`) : 'Top tier 🎉'}
                </span>
            </div>
            <div className="yd-tier__track">
                <div className="yd-tier__fill" style={{ width: `${pct}%` }} />
                {TIERS.filter(t => t.min > 0).map(t => (
                    <div key={t.label} className="yd-tier__milestone" style={{ left: `${(t.min / MAX_TRACK) * 100}%` }}>
                        <div className={`yd-tier__dot${averageKids >= t.min ? ' is-reached' : ''}`} />
                        <div className="yd-tier__milelabel">{t.label}<span>{t.min}+</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionHeader({ icon, title, sub, action }) {
    return (
        <div className="yd-sec">
            <div className="yd-sec__left">
                <span className="yd-sec__icon">{icon}</span>
                <div>
                    <div className="yd-sec__title">{title}</div>
                    {sub && <div className="yd-sec__sub">{sub}</div>}
                </div>
            </div>
            {action}
        </div>
    );
}

/* ── Loading skeleton ───────────────────────────────────────── */
function LoadingSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
            {/* Hero skeleton */}
            <div className="yd-mhero" style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <div className="yd-skel--dark" style={{ height: 12, width: 140, marginBottom: '0.6rem' }} />
                        <div className="yd-skel--dark" style={{ height: 44, width: 260 }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div className="yd-skel--dark" style={{ height: 40, width: 90, borderRadius: 999 }} />
                        <div className="yd-skel--dark" style={{ height: 40, width: 110, borderRadius: 999 }} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', paddingBottom: '1.75rem', marginBottom: '1.75rem', borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <div className="yd-skel--dark" style={{ height: 11, width: 90, marginBottom: '0.5rem' }} />
                            <div className="yd-skel--dark" style={{ height: 40, width: 64, marginBottom: '0.35rem' }} />
                            <div className="yd-skel--dark" style={{ height: 11, width: 110 }} />
                        </div>
                    ))}
                </div>
                <div className="yd-skel--dark" style={{ height: 10, borderRadius: 999 }} />
            </div>
            {/* Section skeletons */}
            <div className="yd-skel" style={{ height: 180, marginBottom: '1.5rem' }} />
            <div className="yd-row yd-row--2" style={{ marginBottom: '1.5rem' }}>
                <div className="yd-skel" style={{ height: 240 }} />
                <div className="yd-skel" style={{ height: 240 }} />
            </div>
            <div className="yd-skel" style={{ height: 300, marginBottom: '1.5rem' }} />
            <div className="yd-skel" style={{ height: 200 }} />
        </Container>
    );
}

export default function KidsAttendance({ isAuthenticated }) {
    const router = useRouter();
    const saveTimerRef = useRef(null);
    const [goalSavedLabel, setGoalSavedLabel] = useState('');

    const {
        mandirName, data, isLoading, error,
        averageKids, tier,
        leaderInfo, leaderInfoTwo, leaderInfoThree,
        upcomingEvents, kidsList, upcomingAllEvents,
        isEditing, isEditingTwo, isEditingThree,
        setIsEditing, setIsEditingTwo, setIsEditingThree,
        ageDistributionData, genderDistributionData,
        kidsOverTimeData, genderDistributionDataByAgeGroup,
        goals, handleInputChangeGoals, handleSubmitGoals,
        handleInputChangeLeaderInfo, handleSubmitLeaderInfo,
        handleInputChangeLeaderInfoTwo, handleSubmitLeaderInfoTwo,
        handleInputChangeLeaderInfoThree, handleSubmitLeaderInfoThree,
        handleInputChangeEvents, handleEventsDateBlur,
        handleAnotherSubmitEvents, handleSubmitEvents,
        handleDeleteEvent, handleRefreshPage,
        eventsDateError, eventForm, openEvents,
    } = useKidsAttendance(isAuthenticated);

    /* Autosave goals with 900ms debounce */
    const handleGoalChange = (e) => {
        handleInputChangeGoals(e);
        setGoalSavedLabel('');
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            handleSubmitGoals();
            setGoalSavedLabel('Saved');
            setTimeout(() => setGoalSavedLabel(''), 2000);
        }, 900);
    };

    const getOccurrenceCount = (name) => {
        const src = Array.isArray(kidsOverTimeData) ? kidsOverTimeData : data;
        if (!Array.isArray(src)) return 0;
        const keys = {
            'Bal Mandal': ['balMandal', 'bal_mandal', 'balMandalClass', 'bal_mandal_class'],
            'Satsang':    ['satsang', 'satsang_class', 'satsangClass'],
            'Kirtan':     ['kirtan', 'kirtan_class', 'kirtanClass'],
            'Instrument': ['instrument', 'instrument_class', 'instrumentClass'],
            'Dance':      ['dance', 'dance_class', 'danceClass'],
        }[name] || [];
        return src.filter(row => keys.some(k => {
            const v = row[k];
            return v === true || v === 'true' || (typeof v === 'number' && v > 0);
        })).length;
    };

    if (!isAuthenticated) return <h1>EXPIRED</h1>;

    if (isLoading) {
        return (
            <Layout>
                <LoadingSkeleton />
            </Layout>
        );
    }

    const classRows = ['Satsang', 'Bal Mandal', 'Kirtan', 'Instrument', 'Dance']
        .map(n => ({ name: n, count: getOccurrenceCount(n) }))
        .filter(r => r.count > 0);

    const classTones = { Satsang: 'coral', 'Bal Mandal': 'mint', Kirtan: 'lilac', Instrument: 'sun', Dance: 'rose' };
    const maxCount = Math.max(...classRows.map(r => r.count), 1);

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>

                {/* ── Hero ── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="yd-mhero" style={{ marginBottom: '3rem' }}>
                        <div className="yd-mhero__top">
                            <div>
                                <div className="yd-mhero__eyebrow">Mandir dashboard</div>
                                <div className="yd-mhero__name">{mandirName} Mandir</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
                                <button
                                    className="yd-btn yd-btn--cream"
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                                    onClick={() => router.push('/')}
                                >
                                    <Icon name="arrow-left" size={15} />
                                    <span>Home</span>
                                </button>
                                <button
                                    className="yd-btn yd-btn--cream"
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                                    onClick={() => router.push('/submit-satsang')}
                                >
                                    <Icon name="plus" size={15} />
                                    <span>Log satsang</span>
                                </button>
                            </div>
                        </div>

                        <div className="yd-mhero__statgrid">
                            <div>
                                <div className="yd-mhero__lbl">Avg attendance</div>
                                <div className="yd-mhero__big">{averageKids}</div>
                                <div className="yd-mhero__hint">kids per satsang</div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Current tier</div>
                                <div className="yd-mhero__big" style={{ color: 'var(--coral)' }}>{tier}</div>
                                <div className="yd-mhero__hint">
                                    {(() => {
                                        const idx = TIERS.findIndex(t => t.label === tier);
                                        const next = TIERS[idx + 1];
                                        return next ? `${Math.max(0, next.min - averageKids)} more to ${next.label}` : 'Top tier 🎉';
                                    })()}
                                </div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Registered</div>
                                <div className="yd-mhero__big">{kidsList.length}</div>
                                <div className="yd-mhero__hint">yuvaks &amp; yuvatis</div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Classes tracked</div>
                                <div className="yd-mhero__big">{classRows.length}</div>
                                <div className="yd-mhero__hint">activity types</div>
                            </div>
                        </div>

                        <TierTrack averageKids={averageKids} />
                    </div>
                </motion.div>

                {/* ── Staggered sections ── */}
                <motion.div variants={stagger} initial="hidden" animate="show">

                    {/* Leadership */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="users" size={20} />}
                            title="Leadership"
                            sub="The people running things"
                        />
                        <LeaderContactSection
                            leaders={[
                                { leaderInfo,      isEditing,      handleInputChange: handleInputChangeLeaderInfo,      handleSubmit: handleSubmitLeaderInfo,      setIsEditing },
                                { leaderInfo: leaderInfoTwo,   isEditing: isEditingTwo,   handleInputChange: handleInputChangeLeaderInfoTwo,   handleSubmit: handleSubmitLeaderInfoTwo,   setIsEditing: setIsEditingTwo },
                                { leaderInfo: leaderInfoThree, isEditing: isEditingThree, handleInputChange: handleInputChangeLeaderInfoThree, handleSubmit: handleSubmitLeaderInfoThree, setIsEditing: setIsEditingThree },
                            ]}
                        />
                    </motion.div>

                    {/* Class activity + Goals */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <div className="yd-row yd-row--2">

                            {/* Class activity */}
                            <div className="yd-card">
                                <SectionHeader
                                    icon={<Icon name="sparkle" size={20} />}
                                    title="Class activity"
                                    sub="Sessions logged this quarter"
                                />
                                {classRows.length === 0 ? (
                                    <p style={{ color: 'var(--ink-3)', fontStyle: 'italic', margin: 0 }}>No classes recorded yet.</p>
                                ) : (
                                    <div className="yd-classes">
                                        {classRows.map(({ name, count }) => (
                                            <div key={name} className="yd-class">
                                                <div className={`yd-class__dot yd-class__dot--${classTones[name] || 'coral'}`} />
                                                <div className="yd-class__name">{name}</div>
                                                <div className="yd-class__count">{count}</div>
                                                <div className="yd-class__bar">
                                                    <div
                                                        className={`yd-class__barfill yd-class__barfill--${classTones[name] || 'coral'}`}
                                                        style={{ width: `${(count / maxCount) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Goals — autosave */}
                            <div className="yd-card">
                                <div className="yd-sec" style={{ marginBottom: '1.25rem' }}>
                                    <div className="yd-sec__left">
                                        <span className="yd-sec__icon"><Icon name="flag" size={20} /></span>
                                        <div>
                                            <div className="yd-sec__title">Q3 Goals</div>
                                            <div className="yd-sec__sub">Track your quarterly focus areas</div>
                                        </div>
                                    </div>
                                    {goalSavedLabel && (
                                        <span style={{ fontSize: '0.82rem', color: 'var(--mint-deep)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Icon name="check" size={14} stroke={2.5} /> Saved
                                        </span>
                                    )}
                                </div>
                                <div className="yd-goals">
                                    {['goal1', 'goal2', 'goal3'].map((key, i) => (
                                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                            <label style={{ fontSize: '0.82rem', color: 'var(--ink-3)', fontWeight: 600 }}>Goal {i + 1}</label>
                                            <input
                                                className="yd-input"
                                                name={key}
                                                value={goals?.[key] || ''}
                                                onChange={handleGoalChange}
                                                placeholder={`Enter goal ${i + 1}…`}
                                                style={{ minHeight: 40, padding: '0.55rem 0.85rem' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* Attendance charts */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="chart" size={20} />}
                            title="Attendance overview"
                            sub="The shape of your satsang class"
                        />
                        <div className="yd-row yd-row--2" style={{ marginBottom: '1.25rem' }}>
                            <AgeDistributionChart data={ageDistributionData} />
                            <GenderDistributionChart data={genderDistributionData} />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <KidsOverTimeChart data={kidsOverTimeData} />
                        </div>
                        <AttendanceCharts
                            data={kidsOverTimeData}
                            isLoading={isLoading}
                            error={error}
                            activities={activities}
                            kidsList={kidsList}
                            genderDistributionDataByAgeGroup={genderDistributionDataByAgeGroup}
                        />
                    </motion.div>

                    {/* Events */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <UpcomingEvents
                            eventForm={eventForm}
                            upcomingEvents={upcomingEvents}
                            upcomingAllEvents={upcomingAllEvents}
                            handleInputChangeEvents={handleInputChangeEvents}
                            handleEventsDateBlur={handleEventsDateBlur}
                            handleSubmitEvents={handleSubmitEvents}
                            handleDeleteEvent={handleDeleteEvent}
                            handleAnotherSubmitEvents={handleAnotherSubmitEvents}
                            handleRefreshPage={handleRefreshPage}
                            openEvents={openEvents}
                            eventsDateError={eventsDateError}
                        />
                    </motion.div>

                    {/* Roster */}
                    <motion.div variants={fadeUp}>
                        <KidsListTable
                            kidsList={kidsList}
                            onRegister={() => router.push('/register')}
                        />
                    </motion.div>

                </motion.div>
            </Container>
        </Layout>
    );
}
