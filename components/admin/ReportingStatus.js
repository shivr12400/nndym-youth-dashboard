import React from 'react';
import Icon from '../common/Icon';
import { formatMDY } from '../../utils/adminMetrics';
import { statusColor } from './chartTheme';

function gapSummary(m) {
    if (!m.lastReportDate) return 'Never reported';
    if (m.weeksSinceReport === 0) return 'Reported this week';
    if (m.weeksSinceReport === 1) return 'Last reported last week';
    return `${m.weeksSinceReport} weeks since last report`;
}

/** The weeks a mandir skipped, most recent first, trimmed for display. */
function missedLabels(m, limit = 6) {
    const labels = m.missedWeeks.map(w => w.label).reverse();
    if (labels.length <= limit) return { shown: labels, extra: 0 };
    return { shown: labels.slice(0, limit), extra: labels.length - limit };
}

export default function ReportingStatus({ mandirStats }) {
    const needsNudge = [...mandirStats]
        .filter(m => m.missedWeeks.length > 0)
        .sort((a, b) => (b.missedWeeks.length - a.missedWeeks.length)
            || ((b.weeksSinceReport ?? 99) - (a.weeksSinceReport ?? 99)));

    const onTrack = [...mandirStats]
        .filter(m => m.missedWeeks.length === 0)
        .sort((a, b) => b.currentStreak - a.currentStreak || a.name.localeCompare(b.name));

    const streakLeaders = [...mandirStats]
        .sort((a, b) => b.currentStreak - a.currentStreak || b.longestStreak - a.longestStreak)
        .slice(0, 5);

    return (
        <div className="yd-row yd-row--2">
            {/* Missed weeks */}
            <div className="yd-card">
                <div className="yd-card__h">Missed reporting weeks</div>
                <p className="yd-card__sub">
                    Mandirs with at least one week in the window and no satsang logged. Most gaps first.
                </p>

                {needsNudge.length === 0 ? (
                    <p className="yd-empty">
                        <Icon name="check" size={16} stroke={2.5} /> Every mandir reported every week in this window.
                    </p>
                ) : (
                    <ul className="yd-gaplist">
                        {needsNudge.map(m => {
                            const { shown, extra } = missedLabels(m);
                            return (
                                <li key={m.name} className="yd-gap">
                                    <div className="yd-gap__top">
                                        <span className="yd-gap__name">{m.name}</span>
                                        <span className="yd-tag" style={{ color: statusColor(m.band.status) }}>
                                            <span className="yd-statusdot" style={{ background: statusColor(m.band.status) }} aria-hidden />
                                            {m.missedWeeks.length} missed
                                        </span>
                                    </div>
                                    <div className="yd-gap__meta">
                                        {gapSummary(m)}
                                        {m.lastReportDate && ` · last on ${formatMDY(m.lastReportDate)}`}
                                    </div>
                                    <div className="yd-gap__weeks">
                                        {shown.map(label => (
                                            <span key={label} className="yd-weekpill">{label}</span>
                                        ))}
                                        {extra > 0 && <span className="yd-weekpill yd-weekpill--more">+{extra}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Consistency */}
            <div className="yd-card">
                <div className="yd-card__h">Consistent reporters</div>
                <p className="yd-card__sub">
                    Perfect attendance on the reporting calendar, plus the longest active streaks.
                </p>

                {onTrack.length === 0 ? (
                    <p className="yd-empty">No mandir has a clean sheet across this window yet.</p>
                ) : (
                    <div className="yd-clean">
                        {onTrack.map(m => (
                            <span key={m.name} className="yd-cleanpill">
                                <span className="yd-statusdot" style={{ background: statusColor('good') }} aria-hidden />
                                {m.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="yd-subhead">Longest active streaks</div>
                <ul className="yd-streaks">
                    {streakLeaders.map(m => {
                        const pct = m.completedWeeks ? (m.currentStreak / m.completedWeeks) * 100 : 0;
                        return (
                            <li key={m.name} className="yd-streak">
                                <span className="yd-streak__name">{m.name}</span>
                                <span className="yd-streak__track">
                                    <span className="yd-streak__fill" style={{ width: `${Math.min(100, pct)}%` }} />
                                </span>
                                <span className="yd-streak__val">
                                    {m.currentStreak}<span className="yd-streak__unit">wk</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
