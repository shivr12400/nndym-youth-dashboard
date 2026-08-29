import React, { useMemo, useState } from 'react';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Icon from '../components/common/Icon';
import { useAdminOverview } from '../hooks/useAdminOverview';
import ReportingGrid from '../components/admin/ReportingGrid';
import ReportingStatus from '../components/admin/ReportingStatus';
import AttendanceTrendChart from '../components/admin/AttendanceTrendChart';
import MandirSparkGrid from '../components/admin/MandirSparkGrid';
import NewKidsChart from '../components/admin/NewKidsChart';
import MomentumList from '../components/admin/MomentumList';
import LevelMixChart from '../components/admin/LevelMixChart';
import MandirTable from '../components/admin/MandirTable';
import { STATUS, CHROME } from '../components/admin/chartTheme';
import { TIER_STEPS, formatMDY } from '../utils/adminMetrics';

const WINDOWS = [8, 12, 26];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

export function isAdminEmail(userEmail) {
    return !!userEmail && userEmail.split('@')[0].toLowerCase() === 'admin';
}

function SectionHeader({ icon, title, sub }) {
    return (
        <div className="yd-sec">
            <div className="yd-sec__left">
                <span className="yd-sec__icon">{icon}</span>
                <div>
                    <div className="yd-sec__title">{title}</div>
                    {sub && <div className="yd-sec__sub">{sub}</div>}
                </div>
            </div>
        </div>
    );
}

function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
        ? Math.round(sorted[mid])
        : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function LoadingSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
            <div className="yd-mhero" style={{ marginBottom: '2rem' }}>
                <div className="yd-skel--dark" style={{ height: 12, width: 160, marginBottom: '0.75rem' }} />
                <div className="yd-skel--dark" style={{ height: 56, width: 300, marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <div className="yd-skel--dark" style={{ height: 11, width: 90, marginBottom: '0.5rem' }} />
                            <div className="yd-skel--dark" style={{ height: 34, width: 70 }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="yd-skel" style={{ height: 320, marginBottom: '1.5rem' }} />
            <div className="yd-row yd-row--2" style={{ marginBottom: '1.5rem' }}>
                <div className="yd-skel" style={{ height: 260 }} />
                <div className="yd-skel" style={{ height: 260 }} />
            </div>
            <div className="yd-skel" style={{ height: 420 }} />
        </Container>
    );
}

function AccessDenied({ onHome }) {
    return (
        <Container maxWidth="sm" sx={{ pt: 8, pb: 10 }}>
            <div className="yd-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <div className="yd-card__h" style={{ fontSize: '1.4rem' }}>Admins only</div>
                <p style={{ color: 'var(--ink-2)', margin: '0.5rem 0 1.5rem' }}>
                    The network overview is available to the NNDYM admin account. Sign in as
                    <strong> admin@nndym.org</strong> to see every mandir in one view.
                </p>
                <button className="yd-btn yd-btn--primary" onClick={onHome} style={{ margin: '0 auto' }}>
                    <Icon name="arrow-left" size={16} /> Back to home
                </button>
            </div>
        </Container>
    );
}

export default function AdminOverview({ isAuthenticated, userEmail }) {
    const router = useRouter();
    const admin = isAdminEmail(userEmail);
    const [weekWindow, setWeekWindow] = useState(12);

    const {
        weeks, mandirStats, network, colorRank,
        isLoading, isRefreshing, error, fetchedAt, refresh,
    } = useAdminOverview(isAuthenticated, admin, weekWindow);

    const windowLabel = `last ${weekWindow} weeks`;

    const networkMedian = useMemo(() => median(
        mandirStats.flatMap(m => weeks
            .map(w => m.weekly[w.key]?.total)
            .filter(v => typeof v === 'number' && v > 0))
    ), [mandirStats, weeks]);

    const openMandir = (name) => router.push(`/kids-attendance?mandirName=${encodeURIComponent(name)}`);

    if (!isAuthenticated) return <Layout><AccessDenied onHome={() => router.push('/login')} /></Layout>;
    if (!admin) return <Layout><AccessDenied onHome={() => router.push('/')} /></Layout>;
    if (isLoading) return <Layout><LoadingSkeleton /></Layout>;

    const wow = network.weekOverWeek;
    const wowColor = wow === null || Math.abs(wow) < 0.02
        ? 'oklch(1 0 0 / 0.55)'
        : (wow > 0 ? STATUS.good : STATUS.critical);

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>

                {/* ── Hero ── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="yd-mhero" style={{ marginBottom: '2rem' }}>
                        <div className="yd-mhero__top" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <div className="yd-mhero__eyebrow">Admin · network overview</div>
                                <div className="yd-mhero__name">All {network.mandirCount} mandirs</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
                                <button
                                    className="yd-btn yd-btn--cream"
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                                    onClick={() => router.push('/')}
                                >
                                    <Icon name="arrow-left" size={15} /> <span>Home</span>
                                </button>
                                <button
                                    className="yd-btn yd-btn--cream"
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                                    onClick={refresh}
                                    disabled={isRefreshing}
                                >
                                    <Icon name="refresh" size={15} />
                                    <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Hero figure — the one number the page leads with */}
                        <div className="yd-hero-figure">
                            <div className="yd-hero-figure__num">{network.latestTotal}</div>
                            <div className="yd-hero-figure__side">
                                <div className="yd-hero-figure__lbl">
                                    kids across the network in the week of{' '}
                                    {network.latestWeek ? network.latestWeek.label : '—'}
                                </div>
                                {wow !== null && (
                                    <div className="yd-hero-figure__delta" style={{ color: wowColor }}>
                                        {wow > 0 ? '▲' : wow < 0 ? '▼' : '—'} {Math.abs(Math.round(wow * 100))}% vs the week before
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="yd-mhero__statgrid">
                            <div>
                                <div className="yd-mhero__lbl">Reported last week</div>
                                <div className="yd-mhero__big">{network.reportingLatest}/{network.mandirCount}</div>
                                <div className="yd-mhero__hint">{Math.round(network.reportingRate * 100)}% of mandirs</div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Avg reporting rate</div>
                                <div className="yd-mhero__big">{Math.round(network.avgConsistency * 100)}%</div>
                                <div className="yd-mhero__hint">across the {windowLabel}</div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Registered kids</div>
                                <div className="yd-mhero__big">{network.registered}</div>
                                <div className="yd-mhero__hint">
                                    {network.newKids !== null ? `${network.newKids} new this window` : 'roster total'}
                                </div>
                            </div>
                            <div>
                                <div className="yd-mhero__lbl">Needs attention</div>
                                <div className="yd-mhero__big" style={{ color: network.atRisk > 0 ? STATUS.warning : undefined }}>
                                    {network.atRisk}
                                </div>
                                <div className="yd-mhero__hint">mandirs barely reporting</div>
                            </div>
                        </div>

                        <div className="yd-tierstrip">
                            {TIER_STEPS.slice().reverse().map(t => (
                                <span key={t.label} className="yd-tierstrip__item">
                                    <span className="yd-tierstrip__num">{network.tierCounts[t.label] || 0}</span>
                                    <span className="yd-tierstrip__lbl">{t.label}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <div className="yd-alert-card yd-alert-card--coral" style={{ marginBottom: '1.5rem' }}>
                        <div className="yd-alert__eyebrow">Couldn&apos;t load everything</div>
                        <p className="yd-alert__body" style={{ margin: 0 }}>{error}</p>
                    </div>
                )}

                {/* ── One filter row, above everything it scopes ── */}
                <div className="yd-filterbar">
                    <span className="yd-filterbar__lbl">Window</span>
                    <div className="yd-modetabs yd-modetabs--tight">
                        {WINDOWS.map(w => (
                            <button
                                key={w}
                                type="button"
                                className={`yd-modetab${weekWindow === w ? ' is-active' : ''}`}
                                onClick={() => setWeekWindow(w)}
                            >
                                {w} weeks
                            </button>
                        ))}
                    </div>
                    <span className="yd-filterbar__meta">
                        {weeks[0] && `${formatMDY(weeks[0].date)} – today`}
                        {fetchedAt && ` · updated ${fetchedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                    </span>
                </div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    style={{ opacity: isRefreshing ? 0.6 : 1, transition: 'opacity .2s' }}
                >
                    {/* Reporting discipline */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="calendar" size={20} />}
                            title="Who reported, and who didn't"
                            sub="Every mandir against every week in the window"
                        />
                        <div style={{ marginBottom: '1.25rem' }}>
                            <ReportingGrid weeks={weeks} mandirStats={mandirStats} />
                        </div>
                        <ReportingStatus mandirStats={mandirStats} />
                    </motion.div>

                    {/* Attendance over time */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="chart" size={20} />}
                            title="Attendance over time"
                            sub="All mandirs on one scale, then one card each"
                        />
                        <div style={{ marginBottom: '1.25rem' }}>
                            <AttendanceTrendChart weeks={weeks} mandirStats={mandirStats} colorRank={colorRank} />
                        </div>
                        <MandirSparkGrid
                            weeks={weeks}
                            mandirStats={mandirStats}
                            colorRank={colorRank}
                            median={networkMedian}
                            onOpen={openMandir}
                        />
                    </motion.div>

                    {/* Growth */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="sparkle" size={20} />}
                            title="Growth"
                            sub="New faces on the roster and which mandirs are trending"
                        />
                        <div className="yd-row yd-row--2">
                            <NewKidsChart mandirStats={mandirStats} windowLabel={windowLabel} />
                            <MomentumList mandirStats={mandirStats} />
                        </div>
                    </motion.div>

                    {/* Composition */}
                    <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
                        <SectionHeader
                            icon={<Icon name="users" size={20} />}
                            title="Composition"
                            sub="Which age bands each mandir is actually reaching"
                        />
                        <LevelMixChart mandirStats={mandirStats} windowLabel={windowLabel} />
                    </motion.div>

                    {/* Full table */}
                    <motion.div variants={fadeUp}>
                        <SectionHeader
                            icon={<Icon name="trophy" size={20} />}
                            title="The whole network"
                            sub="Sort, scan, export"
                        />
                        <MandirTable mandirStats={mandirStats} weeks={weeks} onOpen={openMandir} />
                    </motion.div>
                </motion.div>

                <p className="yd-footnote" style={{ marginTop: '2rem', color: CHROME.muted }}>
                    A reporting week runs Monday–Sunday and is labelled by its Saturday, so a
                    Saturday and Sunday satsang count as one weekend. The current week is shown but
                    never counted as missed.
                </p>
            </Container>
        </Layout>
    );
}
