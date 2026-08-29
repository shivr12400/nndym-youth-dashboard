import React, { useMemo, useState } from 'react';
import { statusColor } from './chartTheme';

/** Sequential blue, light → dark. Magnitude only — never identity. */
const HEAT_STEPS = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf'];
const HEAT_INK = ['#231A11', '#231A11', '#231A11', '#ffffff', '#ffffff'];

function heatIndex(value, max) {
    if (!max || value <= 0) return 0;
    const idx = Math.ceil((value / max) * HEAT_STEPS.length) - 1;
    return Math.min(HEAT_STEPS.length - 1, Math.max(0, idx));
}

const SORTS = {
    risk: { label: 'Needs attention first', compare: (a, b) => a.consistency - b.consistency || a.name.localeCompare(b.name) },
    best: { label: 'Most consistent first', compare: (a, b) => b.consistency - a.consistency || a.name.localeCompare(b.name) },
    name: { label: 'A–Z', compare: (a, b) => a.name.localeCompare(b.name) },
};

export default function ReportingGrid({ weeks, mandirStats }) {
    const [sortKey, setSortKey] = useState('risk');

    const rows = useMemo(
        () => [...mandirStats].sort(SORTS[sortKey].compare),
        [mandirStats, sortKey]
    );

    const max = useMemo(() => Math.max(
        1,
        ...mandirStats.flatMap(m => weeks.map(w => m.weekly[w.key]?.total || 0))
    ), [mandirStats, weeks]);

    const showNumbers = weeks.length <= 14;

    return (
        <div className="yd-card yd-grid-card">
            <div className="yd-gridhead">
                <div>
                    <div className="yd-card__h">Reporting grid</div>
                    <p className="yd-card__sub">
                        One cell per mandir per week. A filled cell is a logged satsang, shaded by how
                        many kids attended; an empty cell is a week with no report at all. This is also
                        the table view for the trend chart above — every number is here.
                    </p>
                </div>
                <label className="yd-selectwrap">
                    <span className="yd-selectwrap__lbl">Sort</span>
                    <select className="yd-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
                        {Object.entries(SORTS).map(([key, s]) => (
                            <option key={key} value={key}>{s.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="yd-heatlegend">
                <span className="yd-heatlegend__lbl">No report</span>
                <span className="yd-heatcell yd-heatcell--empty" aria-hidden />
                <span className="yd-heatlegend__lbl" style={{ marginLeft: '0.75rem' }}>Fewer kids</span>
                {HEAT_STEPS.map(c => (
                    <span key={c} className="yd-heatcell" style={{ background: c }} aria-hidden />
                ))}
                <span className="yd-heatlegend__lbl">More</span>
            </div>

            <div className="yd-heatscroll">
                <table className="yd-heat">
                    <caption className="yd-visually-hidden">
                        Weekly satsang attendance by mandir. Blank cells mean no report was submitted that week.
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col" className="yd-heat__corner">Mandir</th>
                            {weeks.map(w => (
                                <th
                                    key={w.key}
                                    scope="col"
                                    className={`yd-heat__wk${w.inProgress ? ' is-progress' : ''}`}
                                    title={w.inProgress ? `Week of ${w.label} — in progress` : `Week of ${w.label}`}
                                >
                                    {w.label}
                                </th>
                            ))}
                            <th scope="col" className="yd-heat__score">Reported</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(m => (
                            <tr key={m.name}>
                                <th scope="row" className="yd-heat__name">{m.name}</th>
                                {weeks.map(w => {
                                    const bucket = m.weekly[w.key];
                                    const reported = !!bucket && bucket.sessions > 0;
                                    const total = bucket?.total || 0;
                                    const idx = heatIndex(total, max);
                                    return (
                                        <td key={w.key} className="yd-heat__cell">
                                            <span
                                                className={`yd-heatcell${reported ? '' : ' yd-heatcell--empty'}${w.inProgress ? ' is-progress' : ''}`}
                                                style={reported ? { background: HEAT_STEPS[idx], color: HEAT_INK[idx] } : undefined}
                                                title={
                                                    reported
                                                        ? `${m.name} · week of ${w.label} · ${total} kids`
                                                        : `${m.name} · week of ${w.label} · ${w.inProgress ? 'not reported yet' : 'no report'}`
                                                }
                                            >
                                                {reported && showNumbers ? total : ''}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className="yd-heat__score">
                                    <span className="yd-heat__pct">{Math.round(m.consistency * 100)}%</span>
                                    <span
                                        className="yd-statusdot"
                                        style={{ background: statusColor(m.band.status) }}
                                        aria-hidden
                                    />
                                    <span className="yd-visually-hidden">{m.band.label}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
