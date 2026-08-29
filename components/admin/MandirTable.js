import React, { useMemo, useState } from 'react';
import Icon from '../common/Icon';
import { formatMDY, statsToCsv } from '../../utils/adminMetrics';
import { STATUS, CHROME, statusColor } from './chartTheme';

const COLUMNS = [
    { key: 'name', label: 'Mandir', align: 'left', get: m => m.name },
    { key: 'registeredKids', label: 'Roster', get: m => m.registeredKids },
    { key: 'newKids', label: 'New', get: m => (m.newKids ?? -1) },
    { key: 'avgKids', label: 'Avg', get: m => m.avgKids },
    { key: 'tier', label: 'Tier', get: m => m.tier },
    { key: 'sessions', label: 'Sessions', get: m => m.sessions },
    { key: 'consistency', label: 'Reporting', get: m => m.consistency },
    { key: 'currentStreak', label: 'Streak', get: m => m.currentStreak },
    { key: 'lastReportDate', label: 'Last report', get: m => (m.lastReportDate ? m.lastReportDate.getTime() : 0) },
    { key: 'momentum', label: 'Momentum', get: m => (m.momentum === null ? -Infinity : m.momentum) },
];

function download(filename, text) {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function MandirTable({ mandirStats, weeks, onOpen }) {
    const [sort, setSort] = useState({ key: 'consistency', dir: 'asc' });

    const rows = useMemo(() => {
        const col = COLUMNS.find(c => c.key === sort.key) || COLUMNS[0];
        const sorted = [...mandirStats].sort((a, b) => {
            const av = col.get(a);
            const bv = col.get(b);
            if (typeof av === 'string') return av.localeCompare(bv);
            return av - bv;
        });
        return sort.dir === 'desc' ? sorted.reverse() : sorted;
    }, [mandirStats, sort]);

    const toggleSort = (key) => {
        setSort(prev => (prev.key === key
            ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
            : { key, dir: key === 'name' ? 'asc' : 'desc' }));
    };

    const exportCsv = () => {
        const stamp = new Date().toISOString().slice(0, 10);
        download(`nndym-mandir-overview-${stamp}.csv`, statsToCsv(rows, weeks));
    };

    return (
        <div className="yd-card yd-grid-card">
            <div className="yd-gridhead">
                <div>
                    <div className="yd-card__h">All mandirs</div>
                    <p className="yd-card__sub">
                        Every number on this page in one sortable table. Click a column to re-rank,
                        or a row to open that mandir&apos;s dashboard.
                    </p>
                </div>
                <button type="button" className="yd-btn yd-btn--ghost yd-btn--sm" onClick={exportCsv}>
                    <Icon name="save" size={15} /> Export CSV
                </button>
            </div>

            <div className="yd-tablescroll">
                <table className="yd-table">
                    <thead>
                        <tr>
                            {COLUMNS.map(col => {
                                const active = sort.key === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        className={`${col.align === 'left' ? 'is-left' : ''}${active ? ' is-sorted' : ''}`}
                                        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    >
                                        <button type="button" className="yd-table__sort" onClick={() => toggleSort(col.key)}>
                                            {col.label}
                                            <span className="yd-table__caret" aria-hidden>
                                                {active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
                                            </span>
                                        </button>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(m => (
                            <tr key={m.name} onClick={() => onOpen(m.name)} tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter') onOpen(m.name); }}>
                                <th scope="row" className="is-left">{m.name}</th>
                                <td>{m.registeredKids}</td>
                                <td>{m.newKids === null ? <span className="yd-muted">—</span> : m.newKids}</td>
                                <td>{m.avgKids}</td>
                                <td>
                                    <span className={`yd-badge yd-badge--${m.tier.toLowerCase()}`}>{m.tier}</span>
                                </td>
                                <td>{m.sessions}</td>
                                <td>
                                    <span className="yd-meter" title={`${m.weeksReported} of ${m.completedWeeks} weeks · ${m.band.label}`}>
                                        <span className="yd-meter__track">
                                            <span
                                                className="yd-meter__fill"
                                                style={{ width: `${Math.round(m.consistency * 100)}%`, background: statusColor(m.band.status) }}
                                            />
                                        </span>
                                        <span className="yd-meter__val">{Math.round(m.consistency * 100)}%</span>
                                    </span>
                                </td>
                                <td>{m.currentStreak}</td>
                                <td className="yd-nowrap">{formatMDY(m.lastReportDate)}</td>
                                <td>
                                    {m.momentum === null ? <span className="yd-muted">—</span> : (
                                        <span style={{
                                            color: Math.abs(m.momentum) < 0.02
                                                ? CHROME.muted
                                                : (m.momentum > 0 ? STATUS.good : STATUS.critical),
                                            fontWeight: 600,
                                        }}>
                                            {m.momentum > 0 ? '+' : ''}{Math.round(m.momentum * 100)}%
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
