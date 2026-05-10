import React from 'react';

const ACCENT_TONES = ['coral', 'mint', 'lilac', 'sun', 'rose', 'sage', 'sky'];

function initials(name) {
    return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}

function tierLabel(avg) {
    if (avg >= 50) return 'Gold';
    if (avg >= 35) return 'Silver';
    if (avg >= 30) return 'Bronze';
    return 'Standard';
}

function TrophyIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
            <path d="M17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/>
        </svg>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--cream-2)' }} />
                <div>
                    <div style={{ width: 200, height: 20, borderRadius: 8, background: 'var(--cream-2)', marginBottom: 6 }} />
                    <div style={{ width: 160, height: 14, borderRadius: 8, background: 'var(--cream-2)' }} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: 160, borderRadius: 18, background: 'var(--cream-2)' }} />
                ))}
            </div>
            <div style={{ height: 200, borderRadius: 18, background: 'var(--cream-2)' }} />
        </div>
    );
}

export default function LeaderboardSection({ leaderboardData, isLoading }) {
    if (isLoading) return <LoadingSkeleton />;
    if (!leaderboardData || !leaderboardData.length) return null;

    const top3 = leaderboardData.slice(0, 3);
    const rest  = leaderboardData.slice(3);
    const max   = Math.max(...leaderboardData.map(d => d.avgKids || 0), 1);

    // Podium order: 2nd | 1st | 3rd
    const podiumOrder = top3.length >= 3
        ? [{ entry: top3[1], place: 2 }, { entry: top3[0], place: 1 }, { entry: top3[2], place: 3 }]
        : top3.map((entry, i) => ({ entry, place: i + 1 }));

    return (
        <div style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
            {/* Section header */}
            <div className="yd-sec" style={{ marginBottom: '1.5rem' }}>
                <div className="yd-sec__left">
                    <span className="yd-sec__icon"><TrophyIcon /></span>
                    <div>
                        <h2 className="yd-sec__title">Mandir Leaderboard</h2>
                        <p className="yd-sec__sub">How your mandir stacks up this quarter</p>
                    </div>
                </div>
            </div>

            {/* Podium */}
            {top3.length >= 2 && (
                <div className="yd-podium" style={{ marginBottom: '1.25rem' }}>
                    {podiumOrder.map(({ entry, place }) => (
                        <div key={entry.name} className="yd-podium__col">
                            <div className={`yd-podium__card yd-podium__card--${place}`}>
                                <div className="yd-podium__place">#{place}</div>
                                <div className="yd-podium__name">{entry.name}</div>
                                <div className="yd-podium__num">{entry.avgKids}</div>
                                <div className="yd-podium__lbl">avg / session</div>
                                <div className="yd-podium__meta">
                                    {entry.registeredKids} registered · {entry.sessions} sessions
                                </div>
                            </div>
                            <div className={`yd-podium__base yd-podium__base--${place}`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Rest of list */}
            {rest.length > 0 && (
                <div className="yd-card" style={{ padding: 0 }}>
                    <div className="yd-leaderlist">
                        {rest.map((m, i) => {
                            const tone = ACCENT_TONES[(i + 3) % ACCENT_TONES.length];
                            const rank = i + 4;
                            const pct  = max > 0 ? ((m.avgKids || 0) / max) * 100 : 0;
                            return (
                                <div key={m.name} className="yd-leaderlist__row">
                                    <div className="yd-leaderlist__rank">#{rank}</div>
                                    <div className={`yd-avatar yd-avatar--${tone}`} style={{ width: 36, height: 36, fontSize: 13 }}>
                                        {initials(m.name)}
                                    </div>
                                    <div className="yd-leaderlist__name">{m.name}</div>
                                    <div className="yd-leaderlist__bar-wrap" style={{ display: 'contents' }}>
                                        <div className="yd-leaderlist__bar">
                                            <div className="yd-leaderlist__barfill" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                    <div className="yd-leaderlist__val">{m.avgKids}</div>
                                    <span className={`yd-badge yd-badge--${tierLabel(m.avgKids).toLowerCase()}`}>
                                        {tierLabel(m.avgKids)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
