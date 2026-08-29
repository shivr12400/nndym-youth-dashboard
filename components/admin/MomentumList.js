import React, { useMemo } from 'react';
import { STATUS, CHROME } from './chartTheme';

function pct(value) {
    const rounded = Math.round(value * 100);
    return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function Row({ m }) {
    const rising = m.momentum > 0;
    const flat = Math.abs(m.momentum) < 0.02;
    const color = flat ? CHROME.muted : (rising ? STATUS.good : STATUS.critical);

    return (
        <li className="yd-mom">
            <span className="yd-mom__name">{m.name}</span>
            <span className="yd-mom__nums">
                {Math.round(m.priorAvg)} <span className="yd-mom__arrowtext">→</span> {Math.round(m.recentAvg)}
            </span>
            <span className="yd-mom__delta" style={{ color }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {flat
                        ? <path d="M5 12h14" />
                        : rising ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
                </svg>
                {flat ? 'flat' : pct(m.momentum)}
            </span>
        </li>
    );
}

/**
 * Attendance momentum: mean of the last 4 completed weeks against the 4 before
 * them. Direction is carried by an arrow and a word as well as colour.
 */
export default function MomentumList({ mandirStats }) {
    const ranked = useMemo(
        () => mandirStats
            .filter(m => m.momentum !== null)
            .sort((a, b) => b.momentum - a.momentum),
        [mandirStats]
    );

    const risers = ranked.filter(m => m.momentum > 0.02).slice(0, 5);
    const fallers = ranked.filter(m => m.momentum < -0.02).slice(-5).reverse();

    return (
        <div className="yd-card">
            <div className="yd-card__h">Attendance momentum</div>
            <p className="yd-card__sub">
                Average weekly attendance over the last 4 weeks compared with the 4 weeks before.
                Needs reports in both halves — mandirs that went quiet don&apos;t appear.
            </p>

            {ranked.length === 0 ? (
                <p className="yd-empty">Not enough consecutive reporting yet to measure a trend.</p>
            ) : (
                <>
                    <div className="yd-subhead" style={{ marginTop: 0 }}>Growing</div>
                    {risers.length === 0
                        ? <p className="yd-empty yd-empty--tight">No mandir grew by more than 2%.</p>
                        : <ul className="yd-momlist">{risers.map(m => <Row key={m.name} m={m} />)}</ul>}

                    <div className="yd-subhead">Slipping</div>
                    {fallers.length === 0
                        ? <p className="yd-empty yd-empty--tight">No mandir dropped by more than 2%.</p>
                        : <ul className="yd-momlist">{fallers.map(m => <Row key={m.name} m={m} />)}</ul>}
                </>
            )}
        </div>
    );
}
