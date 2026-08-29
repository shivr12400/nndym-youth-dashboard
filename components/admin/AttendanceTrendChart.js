import React, { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CHROME, SERIES_CAP, seriesColor } from './chartTheme';

function TrendTooltip({ active, label, payload }) {
    if (!active || !payload || !payload.length) return null;

    const rows = payload
        .filter(p => typeof p.value === 'number')
        .sort((a, b) => b.value - a.value);
    if (!rows.length) return null;

    const shown = rows.slice(0, 10);
    const hidden = rows.length - shown.length;

    return (
        <div className="yd-tip">
            <div className="yd-tip__head">Week of {label}</div>
            {shown.map(row => (
                <div key={row.dataKey} className="yd-tip__row">
                    <span className="yd-tip__swatch" style={{ background: row.stroke }} />
                    <span className="yd-tip__name">{row.dataKey}</span>
                    <span className="yd-tip__val">{row.value}</span>
                </div>
            ))}
            {hidden > 0 && <div className="yd-tip__more">+{hidden} more</div>}
        </div>
    );
}

export default function AttendanceTrendChart({ weeks, mandirStats, colorRank }) {
    const [visible, setVisible] = useState(null);   // null = all mandirs
    const [hovered, setHovered] = useState(null);

    const names = useMemo(
        () => [...mandirStats].sort((a, b) => (colorRank[a.name] ?? 99) - (colorRank[b.name] ?? 99)).map(m => m.name),
        [mandirStats, colorRank]
    );

    const isVisible = (name) => (visible ? visible.has(name) : true);

    const toggle = (name) => {
        setVisible(prev => {
            const next = new Set(prev ?? names);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next.size === names.length ? null : next;
        });
    };

    const chartData = useMemo(() => weeks.map(w => {
        const row = { label: w.label, inProgress: w.inProgress };
        for (const m of mandirStats) {
            const bucket = m.weekly[w.key];
            row[m.name] = bucket && bucket.sessions > 0 ? bucket.total : null;
        }
        return row;
    }), [weeks, mandirStats]);

    const drawn = names.filter(isVisible);
    // Grey context lines paint first so the coloured series sit on top of them.
    const ordered = [
        ...drawn.filter(n => (colorRank[n] ?? 99) >= SERIES_CAP),
        ...drawn.filter(n => (colorRank[n] ?? 99) < SERIES_CAP),
        ...(hovered && isVisible(hovered) ? [hovered] : []),
    ];

    return (
        <div className="yd-card">
            <div className="yd-card__h">Attendance over time — every mandir</div>
            <p className="yd-card__sub">
                Weekly satsang attendance per mandir. The eight busiest mandirs keep a fixed colour;
                the rest are drawn in grey — hover any chip below to trace one line. Gaps in
                reporting are bridged here, so use the reporting grid to see missed weeks.
            </p>

            <div className="yd-chips" role="group" aria-label="Mandirs shown in the chart">
                {names.map(name => {
                    const rank = colorRank[name] ?? 99;
                    const color = seriesColor(rank);
                    const on = isVisible(name);
                    return (
                        <button
                            key={name}
                            type="button"
                            className={`yd-chip${on ? ' is-on' : ''}`}
                            aria-pressed={on}
                            onClick={() => toggle(name)}
                            onMouseEnter={() => setHovered(name)}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered(name)}
                            onBlur={() => setHovered(null)}
                        >
                            <span className="yd-chip__dot" style={{ background: on ? color : 'transparent', borderColor: color }} />
                            {name}
                        </button>
                    );
                })}
                <button type="button" className="yd-chip yd-chip--action" onClick={() => setVisible(null)}>
                    Show all
                </button>
                <button
                    type="button"
                    className="yd-chip yd-chip--action"
                    onClick={() => setVisible(new Set(names.filter(n => (colorRank[n] ?? 99) < SERIES_CAP)))}
                >
                    Top 8 only
                </button>
            </div>

            <div className="yd-chartbox" style={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                        <CartesianGrid stroke={CHROME.grid} strokeWidth={1} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fill: CHROME.muted, fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: CHROME.axis }}
                            minTickGap={12}
                        />
                        <YAxis
                            tick={{ fill: CHROME.muted, fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            width={44}
                            allowDecimals={false}
                        />
                        <Tooltip
                            content={<TrendTooltip />}
                            cursor={{ stroke: CHROME.axis, strokeWidth: 1 }}
                        />
                        {ordered.map((name, i) => {
                            const rank = colorRank[name] ?? 99;
                            const isHovered = hovered === name;
                            const dimmed = hovered && !isHovered;
                            return (
                                <Line
                                    key={`${name}-${i}`}
                                    type="monotone"
                                    dataKey={name}
                                    stroke={isHovered ? CHROME.emphasis : seriesColor(rank)}
                                    strokeWidth={isHovered ? 2.5 : 2}
                                    strokeOpacity={dimmed ? 0.18 : 1}
                                    dot={false}
                                    activeDot={dimmed ? false : { r: 4, strokeWidth: 2, stroke: CHROME.surface }}
                                    connectNulls
                                    isAnimationActive={false}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
