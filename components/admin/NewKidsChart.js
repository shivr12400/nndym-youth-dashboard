import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';
import { CHROME, SERIES } from './chartTheme';

function BarTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;
    const row = payload[0].payload;
    return (
        <div className="yd-tip">
            <div className="yd-tip__head">{row.name}</div>
            <div className="yd-tip__row">
                <span className="yd-tip__swatch" style={{ background: SERIES[0] }} />
                <span className="yd-tip__name">New kids</span>
                <span className="yd-tip__val">{row.newKids}</span>
            </div>
            <div className="yd-tip__more">{row.registeredKids} on the roster</div>
        </div>
    );
}

/**
 * One measure, one colour — the bar length already encodes magnitude, so
 * shading it by value would spend the colour channel on nothing.
 */
export default function NewKidsChart({ mandirStats, windowLabel }) {
    const rows = useMemo(
        () => mandirStats
            .filter(m => m.hasRegistrationDates)
            .map(m => ({ name: m.name, newKids: m.newKids || 0, registeredKids: m.registeredKids }))
            .sort((a, b) => b.newKids - a.newKids),
        [mandirStats]
    );

    const missing = mandirStats.length - rows.length;
    const total = rows.reduce((s, r) => s + r.newKids, 0);

    return (
        <div className="yd-card">
            <div className="yd-card__h">New kids registered</div>
            <p className="yd-card__sub">
                Kids added to a mandir roster in the {windowLabel}.
                {rows.length > 0 && ` ${total} across ${rows.length} mandir${rows.length === 1 ? '' : 's'}.`}
            </p>

            {rows.length === 0 ? (
                <p className="yd-empty">
                    The kids API doesn&apos;t return a registration date on its records, so new
                    registrations can&apos;t be dated. Roster sizes are still in the mandir table below,
                    and the momentum panel tracks attendance growth instead.
                </p>
            ) : (
                <>
                    <div className="yd-chartbox" style={{ height: Math.max(200, rows.length * 34 + 40) }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 4 }}>
                                <CartesianGrid stroke={CHROME.grid} strokeWidth={1} horizontal={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fill: CHROME.muted, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: CHROME.axis }}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: CHROME.ink2, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={104}
                                />
                                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(35,26,17,0.04)' }} />
                                <Bar dataKey="newKids" fill={SERIES[0]} barSize={16} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                                    <LabelList
                                        dataKey="newKids"
                                        position="right"
                                        offset={8}
                                        style={{ fill: CHROME.ink2, fontSize: 12, fontVariantNumeric: 'tabular-nums' }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {missing > 0 && (
                        <p className="yd-footnote">
                            {missing} mandir{missing === 1 ? '' : 's'} excluded — their kid records carry no
                            registration date.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
