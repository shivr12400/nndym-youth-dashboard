import React, { useMemo } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CHROME, seriesColor, statusColor } from './chartTheme';
import Icon from '../common/Icon';

/**
 * Small multiples — the readable answer to "13 lines on one chart". Every card
 * shares one y-scale, so heights are comparable across mandirs, and the grey
 * rule is the network median for that week range.
 */
export default function MandirSparkGrid({ weeks, mandirStats, colorRank, median, onOpen }) {
    const max = useMemo(() => Math.max(
        1,
        ...mandirStats.flatMap(m => weeks.map(w => m.weekly[w.key]?.total || 0))
    ), [mandirStats, weeks]);

    const cards = useMemo(
        () => [...mandirStats].sort((a, b) => b.avgKids - a.avgKids || a.name.localeCompare(b.name)),
        [mandirStats]
    );

    return (
        <div className="yd-card">
            <div className="yd-card__h">Every mandir, side by side</div>
            <p className="yd-card__sub">
                The same weekly attendance, one card per mandir on a shared scale (0–{max}). The grey
                rule is the network median ({median}). Open any card for its full dashboard.
            </p>

            <div className="yd-sparkgrid">
                {cards.map(m => {
                    const data = weeks.map(w => ({
                        label: w.label,
                        value: m.weekly[w.key]?.sessions ? m.weekly[w.key].total : null,
                    }));
                    const latest = [...data].reverse().find(d => d.value !== null);
                    const color = seriesColor(colorRank[m.name] ?? 99);

                    return (
                        <button
                            key={m.name}
                            type="button"
                            className="yd-spark"
                            onClick={() => onOpen(m.name)}
                            title={`Open the ${m.name} dashboard`}
                        >
                            <div className="yd-spark__top">
                                <span className="yd-spark__name">{m.name}</span>
                                <span className="yd-spark__open"><Icon name="arrow-right" size={13} /></span>
                            </div>
                            <div className="yd-spark__stats">
                                <span className="yd-spark__big">{latest ? latest.value : '—'}</span>
                                <span className="yd-spark__lbl">latest week</span>
                                <span
                                    className="yd-statusdot"
                                    style={{ background: statusColor(m.band.status), marginLeft: 'auto' }}
                                    aria-hidden
                                />
                                <span className="yd-spark__pct">{Math.round(m.consistency * 100)}%</span>
                            </div>
                            <div className="yd-spark__chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                                        <YAxis hide domain={[0, max]} />
                                        <ReferenceLine y={median} stroke={CHROME.grid} strokeWidth={1} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={color}
                                            strokeWidth={2}
                                            dot={false}
                                            connectNulls
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="yd-spark__foot">
                                avg {m.avgKids} · {m.registeredKids} on roster · {m.band.label.toLowerCase()}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
