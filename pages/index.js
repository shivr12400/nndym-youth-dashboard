import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LeaderboardSection from '../components/LeaderboardSection';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { mandirs } from '../utils/mandirs';

function normalize(str) {
    return str.toLowerCase().replace(/[\s-]/g, '');
}

function isAdmin(userEmail) {
    if (!userEmail) return false;
    return userEmail.split('@')[0] === 'admin';
}

function getUserMandir(userEmail) {
    if (!userEmail) return null;
    const prefix = userEmail.split('@')[0];
    return mandirs.find(m => normalize(m.mandirName) === normalize(prefix)) || null;
}

function tierLabel(avg) {
    if (avg >= 50) return 'Gold';
    if (avg >= 35) return 'Silver';
    if (avg >= 30) return 'Bronze';
    return 'Standard';
}

const TIER_NEXT = { Standard: { label: 'Bronze', min: 30 }, Bronze: { label: 'Silver', min: 35 }, Silver: { label: 'Gold', min: 50 }, Gold: null };

/* ── Inline SVG icons ─────────────────────────────────────────── */
function ArrowRightIcon({ size = 16 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
}
function PlusIcon({ size = 16 }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14"/></svg>;
}

/* ── Snapshot card (dark ink card with mandir stats) ─────────── */
function MandirSnapshot({ mandirName, avgKids, registeredKids, onOpen }) {
    const tier = tierLabel(avgKids);
    const next = TIER_NEXT[tier];
    const need = next ? Math.max(0, next.min - avgKids) : 0;
    const pct  = next ? Math.min(100, (avgKids / next.min) * 100) : 100;

    return (
        <div className="yd-snap">
            <div className="yd-snap__head">
                <div>
                    <div className="yd-snap__eyebrow">Your mandir</div>
                    <div className="yd-snap__name">{mandirName}</div>
                </div>
                <span className={`yd-badge yd-badge--${tier.toLowerCase()}`}>{tier}</span>
            </div>
            <div className="yd-snap__stats">
                <div>
                    <div className="yd-snap__val">{avgKids}</div>
                    <div className="yd-snap__lbl">avg / session</div>
                </div>
                <div>
                    <div className="yd-snap__val">{registeredKids}</div>
                    <div className="yd-snap__lbl">registered</div>
                </div>
                <div>
                    <div className="yd-snap__val">{tier}</div>
                    <div className="yd-snap__lbl">current tier</div>
                </div>
            </div>
            <div>
                <div className="yd-snap__progress-head">
                    <span>Progress to {next ? next.label : 'top tier'}</span>
                    <span>{next ? `${need} more` : '🎉 max'}</span>
                </div>
                <div className="yd-progress">
                    <div className="yd-progress__fill" style={{ width: `${pct}%` }} />
                </div>
            </div>
            <button className="yd-snap__open" onClick={onOpen}>
                Open dashboard <ArrowRightIcon size={16} />
            </button>
        </div>
    );
}

/* ── Placeholders shown until the data lands ──────────────────── */
function SnapshotSkeleton() {
    return (
        <div className="yd-snap" aria-busy="true">
            <div className="yd-skel--dark" style={{ height: 11, width: 80, marginBottom: '0.5rem' }} />
            <div className="yd-skel--dark" style={{ height: 26, width: 150 }} />
            <div className="yd-snap__stats">
                {[0, 1, 2].map(i => (
                    <div key={i}>
                        <div className="yd-skel--dark" style={{ height: 30, width: 56, marginBottom: '0.4rem' }} />
                        <div className="yd-skel--dark" style={{ height: 11, width: 76 }} />
                    </div>
                ))}
            </div>
            <div className="yd-skel--dark" style={{ height: 10, borderRadius: 999 }} />
            <div className="yd-skel--dark" style={{ height: 42, borderRadius: 12 }} />
        </div>
    );
}

function AlertCardSkeleton() {
    return (
        <div className="yd-alert-card yd-alert-card--info" aria-busy="true">
            <div className="yd-loading">
                <div className="yd-loading__ring" />
                <span>Checking your weekend counts…</span>
            </div>
        </div>
    );
}

/* ── Alert card ───────────────────────────────────────────────── */
function AlertCard({ tone, eyebrow, title, body, action, href, onAction }) {
    return (
        <div className={`yd-alert-card yd-alert-card--${tone}`}>
            <div className="yd-alert__eyebrow">{eyebrow}</div>
            <h3 className="yd-alert__title">{title}</h3>
            <p className="yd-alert__body">{body}</p>
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="yd-alert__action">
                    {action} <ArrowRightIcon size={14} />
                </a>
            ) : (
                <button className="yd-alert__action" onClick={onAction}>
                    {action} <ArrowRightIcon size={14} />
                </button>
            )}
        </div>
    );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function Dashboard({ isAuthenticated, userEmail }) {
    const router = useRouter();
    const { leaderboardData, datesByMandir, failedMandirs, isLoading: leaderboardLoading } = useLeaderboard(isAuthenticated);
    const admin = isAdmin(userEmail);
    const userMandir = admin ? null : getUserMandir(userEmail);

    const prevWeekendDates = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = today.getDay();

        const prevSat = new Date(today);
        prevSat.setDate(today.getDate() - (day + 1));
        const prevSun = new Date(today);
        prevSun.setDate(today.getDate() - (day === 0 ? 7 : day));

        const fmt = (d) =>
            `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

        return { sat: fmt(prevSat), sun: fmt(prevSun) };
    }, []);

    // useLeaderboard already pulled every mandir's satsang history, so the
    // weekend check reads from that instead of firing its own request for a
    // response the page is holding anyway.
    const missingSatsang = useMemo(() => {
        if (admin || !userMandir) return false;
        const dates = datesByMandir[userMandir.mandirName];
        if (!dates) return false;
        return !dates.has(prevWeekendDates.sat) && !dates.has(prevWeekendDates.sun);
    }, [admin, userMandir, datesByMandir, prevWeekendDates]);

    // Non-admins can't be told "all caught up" until the history is in — until
    // then the card is a placeholder rather than a guess.
    const weekendStatusPending = !admin && leaderboardLoading;

    // If the user's own mandir is one of the ones that failed to load we know
    // nothing about its weekend — saying "all caught up" would be a guess
    // dressed up as a fact.
    const ownMandirFailed = !admin && !!userMandir && failedMandirs.includes(userMandir.mandirName);

    const handleMandirSelect = (name) => {
        router.push(`/kids-attendance?mandirName=${encodeURIComponent(name)}`);
    };

    const mandirName = userMandir?.mandirName || '';
    const mandirLeaderData = leaderboardData.find(
        d => normalize(d.name) === normalize(mandirName)
    );

    const greeting = mandirName
        ? `Hi ${mandirName} Mandir 👋`
        : admin ? 'Select a Mandir' : 'Welcome';

    const subtitle = admin
        ? 'Choose a mandir to manage attendance and view its dashboard.'
        : 'Your mandir is moving — keep the momentum going.';

    return (
        <Layout>
            <div className="yd-main">
                <div className="yd-page">

                    {/* ── Hero ───────────────────────────────────────────── */}
                    <section className="yd-hero">
                        <div className="yd-hero__copy">
                            <div className="yd-hero__eyebrow">
                                <span className="yd-dot yd-dot--mint" />
                                {admin ? 'Admin · All Mandirs' : `Signed in · ${mandirName || '…'} Mandir`}
                            </div>
                            <h1 className="yd-hero__title">{greeting}</h1>
                            <p className="yd-hero__sub">{subtitle}</p>
                            <div className="yd-hero__actions">
                                {admin ? (
                                    <>
                                        <button
                                            className="yd-btn yd-btn--primary"
                                            onClick={() => router.push('/admin')}
                                        >
                                            Network overview <ArrowRightIcon size={16} />
                                        </button>
                                        <span style={{ color: 'var(--ink-3)', fontSize: '0.95rem', alignSelf: 'center' }}>
                                            or pick a mandir to open its dashboard.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="yd-btn yd-btn--primary"
                                            onClick={() => userMandir && handleMandirSelect(userMandir.mandirName)}
                                            disabled={!userMandir}
                                        >
                                            Open my mandir <ArrowRightIcon size={16} />
                                        </button>
                                        <button
                                            className="yd-btn yd-btn--ghost"
                                            onClick={() => router.push('/submit-satsang')}
                                        >
                                            <PlusIcon size={16} /> Log a satsang
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Snapshot card or admin mandir grid */}
                        <div>
                            {admin ? (
                                <div className="yd-card" style={{ padding: '1.5rem' }}>
                                    <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--ink)' }}>
                                        Mandirs
                                    </p>
                                    <div className="yd-mandirs" style={{ justifyContent: 'flex-start' }}>
                                        {mandirs.map((m) => (
                                            <button
                                                key={m.mandirName}
                                                className="yd-mandir-btn"
                                                onClick={() => handleMandirSelect(m.mandirName)}
                                            >
                                                {m.mandirName} <ArrowRightIcon size={14} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : leaderboardLoading ? (
                                <SnapshotSkeleton />
                            ) : mandirLeaderData ? (
                                <MandirSnapshot
                                    mandirName={mandirName}
                                    avgKids={mandirLeaderData.avgKids}
                                    registeredKids={mandirLeaderData.registeredKids}
                                    onOpen={() => userMandir && handleMandirSelect(userMandir.mandirName)}
                                />
                            ) : (
                                <div className="yd-snap" style={{ opacity: 0.6 }}>
                                    <div className="yd-snap__eyebrow">Your mandir</div>
                                    <div className="yd-snap__name">{mandirName || '—'}</div>
                                    <p style={{ color: 'oklch(1 0 0 / 0.5)', fontSize: '0.9rem', margin: 0 }}>
                                        No data yet — log your first satsang to get started.
                                    </p>
                                    <button
                                        className="yd-btn yd-btn--primary"
                                        onClick={() => router.push('/submit-satsang')}
                                        style={{ alignSelf: 'flex-start' }}
                                    >
                                        <PlusIcon size={16} /> Log satsang
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── Alert cards ─────────────────────────────────────── */}
                    <section className="yd-alerts">
                        <AlertCard
                            tone="lilac"
                            eyebrow="NNDYM Retreat 2026"
                            title="Registration is open"
                            body="Don't forget to register kids from your mandir before the deadline."
                            action="Register now"
                            href="https://nndym.org/retreat"
                        />
                        {weekendStatusPending ? (
                            <AlertCardSkeleton />
                        ) : ownMandirFailed ? (
                            <AlertCard
                                tone="coral"
                                eyebrow="Couldn't check"
                                title="Your data didn't load"
                                body={`We couldn't reach ${mandirName}'s records just now, so we can't tell you whether the weekend is logged. Reload to try again.`}
                                action="Reload"
                                onAction={() => router.reload()}
                            />
                        ) : missingSatsang ? (
                            <AlertCard
                                tone="coral"
                                eyebrow="Heads up"
                                title="Weekend count missing"
                                body={`No satsang count recorded for ${prevWeekendDates.sat} or ${prevWeekendDates.sun}. Log it in 30 seconds.`}
                                action="Log now"
                                onAction={() => router.push('/submit-satsang')}
                            />
                        ) : (
                            <AlertCard
                                tone="info"
                                eyebrow="All caught up"
                                title="Counts are up to date"
                                body="Your satsang attendance is logged for the previous weekend. Great work keeping it consistent!"
                                action="View dashboard"
                                onAction={() => userMandir && handleMandirSelect(userMandir.mandirName)}
                            />
                        )}
                    </section>

                    {/* ── Leaderboard ─────────────────────────────────────── */}
                    <section>
                        <LeaderboardSection leaderboardData={leaderboardData} isLoading={leaderboardLoading} />
                    </section>

                </div>
            </div>
        </Layout>
    );
}
