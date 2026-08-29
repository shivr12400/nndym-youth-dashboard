import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CHROME, ORDINAL_BLUE } from './chartTheme';
import { LEVELS } from '../../utils/adminMetrics';

function MixTooltip({ active, payload, share }) {
    if (!active || !payload || !payload.length) return null;
    const row = payload[0].payload;
    return (
        <div className="yd-tip">
            <div className="yd-tip__head">{row.name}</div>
            {LEVELS.map((l, i) => (
                <div key={l.key} className="yd-tip__row">
                    <span className="yd-tip__swatch" style={{ background: ORDINAL_BLUE[i] }} />
                    <span className="yd-tip__name">{l.label}</span>
                    <span className="yd-tip__val">
                        {share ? `${Math.round(row[l.label])}%` : row[l.label]}
                    </span>
                </div>
            ))}
            <div className="yd-tip__more">{row.total} kid-visits logged</div>
        </div>
    );
}

/**
 * Age bands are an *ordered* category, so they get a single-hue ramp rather
 * than four identities. Segments are separated by a 2px surface gap.
 */
export default function LevelMixChart({ mandirStats, windowLabel }) {
    const [share, setShare] = useState(false);

    const rows = useMemo(() => mandirStats
        .map(m => {
            const total = m.levelTotals.reduce((s, v) => s + v, 0);
            const row = { name: m.name, total };
            LEVELS.forEach((l, i) => {
                const v = m.levelTotals[i];
                row[l.label] = share && total > 0 ? (v / total) * 100 : v;
            });
            return row;
        })
        .filter(r => r.total > 0)
        .sort((a, b) => b.total - a.total), [mandirStats, share]);

    return (
        <div className="yd-card">
            <div className="yd-gridhead">
                <div>
                    <div className="yd-card__h">Who is showing up — age mix by mandir</div>
                    <p className="yd-card__sub">
                        Every kid counted across the {windowLabel}, split by the age band they were logged
                        under. Tall bars are volume; the mix shows where each mandir&apos;s strength sits.
                    </p>
                </div>
                <div className="yd-modetabs yd-modetabs--tight">
                    <button type="button" className={`yd-modetab${share ? '' : ' is-active'}`} onClick={() => setShare(false)}>Total</button>
                    <button type="button" className={`yd-modetab${share ? ' is-active' : ''}`} onClick={() => setShare(true)}>Share</button>
                </div>
            </div>

            <div className="yd-legend">
                {LEVELS.map((l, i) => (
                    <span key={l.key} className="yd-legend__item">
                        <span className="yd-legend__swatch" style={{ background: ORDINAL_BLUE[i] }} aria-hidden />
                        {l.label}
                    </span>
                ))}
            </div>

            {rows.length === 0 ? (
                <p className="yd-empty">No attendance logged in this window.</p>
            ) : (
                <div className="yd-chartbox" style={{ height: Math.max(220, rows.length * 34 + 40) }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                            <CartesianGrid stroke={CHROME.grid} strokeWidth={1} horizontal={false} />
                            <XAxis
                                type="number"
                                tick={{ fill: CHROME.muted, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: CHROME.axis }}
                                allowDecimals={false}
                                domain={share ? [0, 100] : undefined}
                                tickFormatter={v => (share ? `${v}%` : v)}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fill: CHROME.ink2, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={104}
                            />
                            <Tooltip content={<MixTooltip share={share} />} cursor={{ fill: 'rgba(35,26,17,0.04)' }} />
                            {LEVELS.map((l, i) => (
                                <Bar
                                    key={l.key}
                                    dataKey={l.label}
                                    stackId="mix"
                                    fill={ORDINAL_BLUE[i]}
                                    stroke={CHROME.surface}
                                    strokeWidth={2}
                                    barSize={18}
                                    radius={i === LEVELS.length - 1 ? [0, 4, 4, 0] : 0}
                                    isAnimationActive={false}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
