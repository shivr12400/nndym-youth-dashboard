/**
 * Pure helpers for the admin overview page.
 *
 * Satsang records carry a `date` in MM/DD/YYYY and four per-age-band counts.
 * Everything here buckets those into *reporting weeks* so we can answer the two
 * admin questions: who reported, and who didn't.
 *
 * A reporting week is anchored on its **Saturday**. Mandirs run satsang on
 * Saturday or Sunday, so a Sunday-anchored week would split one weekend across
 * two buckets. Anchoring on the Saturday of the Mon–Sun week keeps a weekend
 * together.
 */

export const LEVELS = [
    { key: 'numberKidsFirstLevel', label: 'Ages 1–8' },
    { key: 'numberKidsSecondLevel', label: 'Ages 9–13' },
    { key: 'numberKidsThirdLevel', label: 'Ages 14–18' },
    { key: 'numberKidsFourthLevel', label: 'Ages 19–25' },
];

export const TIER_STEPS = [
    { label: 'Standard', min: 0 },
    { label: 'Bronze', min: 30 },
    { label: 'Silver', min: 35 },
    { label: 'Gold', min: 50 },
];

/** Keys a Lambda might use to stamp when a kid was registered. */
const REGISTERED_AT_KEYS = [
    'dateRegistered', 'registrationDate', 'registeredDate', 'registeredOn',
    'registrationTimestamp', 'dateAdded', 'dateCreated', 'createdAt',
    'created_at', 'createdDate', 'creationDate', 'joinDate', 'joinedDate',
    'signupDate', 'timestamp',
];

const MIN_PLAUSIBLE_YEAR = 2015;

export function tierFor(avgKids) {
    return TIER_STEPS.reduce((acc, t) => (avgKids >= t.min ? t.label : acc), 'Standard');
}

/** Parse MM/DD/YYYY, ISO, or an epoch value into a local-midnight Date. */
export function parseDateValue(value) {
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

    if (typeof value === 'number') {
        const ms = value < 1e12 ? value * 1000 : value;
        const d = new Date(ms);
        return isNaN(d.getTime()) ? null : d;
    }

    const s = String(value).trim();
    if (!s) return null;

    const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (mdy) {
        const d = new Date(Number(mdy[3]), Number(mdy[1]) - 1, Number(mdy[2]));
        return isNaN(d.getTime()) ? null : d;
    }

    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (iso) {
        const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        return isNaN(d.getTime()) ? null : d;
    }

    if (/^\d{10}$|^\d{13}$/.test(s)) return parseDateValue(Number(s));

    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

/** The Saturday that anchors the Mon–Sun week containing `date`. */
export function weekAnchor(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dow = d.getDay();                       // 0 = Sun … 6 = Sat
    d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow)); // back to Monday
    d.setDate(d.getDate() + 5);                   // forward to Saturday
    return d;
}

export function weekKey(date) {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function weekLabel(date) {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatMDY(date) {
    if (!date) return '—';
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${m}/${d}/${date.getFullYear()}`;
}

/**
 * The window shown across the page: `completedWeeks` finished weeks plus the
 * week currently in progress (flagged, and excluded from every score — nobody
 * has "missed" a weekend that hasn't happened yet).
 */
export function buildWeeks(completedWeeks, today = new Date()) {
    const current = weekAnchor(today);
    const weeks = [];
    for (let i = completedWeeks; i >= 0; i--) {
        const d = new Date(current);
        d.setDate(current.getDate() - i * 7);
        weeks.push({ key: weekKey(d), date: d, label: weekLabel(d), inProgress: i === 0 });
    }
    return weeks;
}

export function recordTotal(row) {
    return LEVELS.reduce((sum, l) => sum + (Number(row?.[l.key]) || 0), 0);
}

/** Normalize the raw satsang rows for one mandir into dated, totalled records. */
export function normalizeSatsangRecords(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter(Boolean)
        .map(row => {
            const date = parseDateValue(row.date ?? row.Date);
            return {
                date,
                weekKey: date ? weekKey(weekAnchor(date)) : null,
                total: recordTotal(row),
                levels: LEVELS.map(l => Number(row?.[l.key]) || 0),
                reporter: row.reporter || row.Reporter || '',
            };
        })
        .filter(r => r.date)
        .sort((a, b) => a.date - b.date);
}

/** Pull a registration date off a kid record, if the API happens to stamp one. */
export function kidRegisteredAt(kid) {
    if (!kid) return null;
    const maxYear = new Date().getFullYear() + 1;
    for (const key of REGISTERED_AT_KEYS) {
        if (kid[key] === undefined || kid[key] === null || kid[key] === '') continue;
        const d = parseDateValue(kid[key]);
        if (d && d.getFullYear() >= MIN_PLAUSIBLE_YEAR && d.getFullYear() <= maxYear) return d;
    }
    return null;
}

/** Longest run of consecutive reported weeks, and the run ending at `weeks[last]`. */
function streaks(weeks, reportedKeys) {
    let longest = 0;
    let run = 0;
    for (const w of weeks) {
        if (reportedKeys.has(w.key)) {
            run += 1;
            longest = Math.max(longest, run);
        } else {
            run = 0;
        }
    }
    // Current streak walks backwards from the most recent week, tolerating an
    // in-progress week that simply hasn't been reported yet.
    let current = 0;
    for (let i = weeks.length - 1; i >= 0; i--) {
        if (reportedKeys.has(weeks[i].key)) current += 1;
        else if (weeks[i].inProgress) continue;
        else break;
    }
    return { longest, current };
}

export const CONSISTENCY_BANDS = [
    { min: 0.85, label: 'Consistent', status: 'good' },
    { min: 0.6, label: 'Mostly on time', status: 'warning' },
    { min: 0.25, label: 'Spotty', status: 'serious' },
    { min: 0, label: 'At risk', status: 'critical' },
];

export function consistencyBand(ratio) {
    return CONSISTENCY_BANDS.find(b => ratio >= b.min) || CONSISTENCY_BANDS[CONSISTENCY_BANDS.length - 1];
}

/**
 * Roll one mandir's raw payload into every stat the page needs.
 * `weeks` is the shared window so all mandirs line up column-for-column.
 */
export function buildMandirStats({ name, kids, records, weeks, today = new Date() }) {
    const completed = weeks.filter(w => !w.inProgress);
    const windowStart = weeks[0]?.date ?? today;

    const weekly = {};
    for (const r of records) {
        if (!r.weekKey) continue;
        const bucket = weekly[r.weekKey] || (weekly[r.weekKey] = { total: 0, sessions: 0, levels: [0, 0, 0, 0] });
        bucket.total += r.total;
        bucket.sessions += 1;
        r.levels.forEach((v, i) => { bucket.levels[i] += v; });
    }

    const reportedKeys = new Set(Object.keys(weekly).filter(k => weekly[k].sessions > 0));
    const missedWeeks = completed.filter(w => !reportedKeys.has(w.key));
    const weeksReported = completed.length - missedWeeks.length;
    const consistency = completed.length ? weeksReported / completed.length : 0;

    // Attendance averages use every session on record, not just the window —
    // that's what the tier is based on elsewhere in the app.
    const attended = records.filter(r => r.total > 0);
    const avgKids = attended.length
        ? Math.round(attended.reduce((s, r) => s + r.total, 0) / attended.length)
        : 0;

    // Momentum: last 4 completed weeks vs the 4 before them.
    const inWindowTotals = (subset) => {
        const vals = subset.map(w => weekly[w.key]?.total).filter(v => typeof v === 'number' && v > 0);
        return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    };
    const recentAvg = inWindowTotals(completed.slice(-4));
    const priorAvg = inWindowTotals(completed.slice(-8, -4));
    const momentum = recentAvg !== null && priorAvg !== null && priorAvg > 0
        ? (recentAvg - priorAvg) / priorAvg
        : null;

    const lastRecord = records.length ? records[records.length - 1] : null;
    const weeksSinceReport = lastRecord
        ? Math.max(0, Math.round((weekAnchor(today) - weekAnchor(lastRecord.date)) / (7 * 86400000)))
        : null;

    const levelTotals = [0, 0, 0, 0];
    for (const w of weeks) {
        const b = weekly[w.key];
        if (b) b.levels.forEach((v, i) => { levelTotals[i] += v; });
    }

    const datedKids = kids.map(k => kidRegisteredAt(k)).filter(Boolean);
    const hasRegistrationDates = datedKids.length > 0;
    const newKids = hasRegistrationDates
        ? datedKids.filter(d => d >= windowStart).length
        : null;

    const { longest, current } = streaks(weeks, reportedKeys);

    return {
        name,
        registeredKids: kids.length,
        avgKids,
        tier: tierFor(avgKids),
        sessions: attended.length,
        weekly,
        weeksReported,
        completedWeeks: completed.length,
        consistency,
        band: consistencyBand(consistency),
        missedWeeks,
        lastReportDate: lastRecord?.date ?? null,
        weeksSinceReport,
        currentStreak: current,
        longestStreak: longest,
        recentAvg,
        priorAvg,
        momentum,
        levelTotals,
        newKids,
        hasRegistrationDates,
    };
}

/** Network-wide rollup across every mandir. */
export function buildNetworkStats(mandirStats, weeks) {
    const completed = weeks.filter(w => !w.inProgress);
    const latest = completed[completed.length - 1];
    const previous = completed[completed.length - 2];

    const weekTotal = (week) => (week
        ? mandirStats.reduce((s, m) => s + (m.weekly[week.key]?.total || 0), 0)
        : 0);

    const latestTotal = weekTotal(latest);
    const previousTotal = weekTotal(previous);

    const reportingLatest = latest
        ? mandirStats.filter(m => m.weekly[latest.key]?.sessions > 0).length
        : 0;

    const registered = mandirStats.reduce((s, m) => s + m.registeredKids, 0);
    const sessions = mandirStats.reduce((s, m) => s + m.sessions, 0);
    const avgConsistency = mandirStats.length
        ? mandirStats.reduce((s, m) => s + m.consistency, 0) / mandirStats.length
        : 0;

    const withNewKids = mandirStats.filter(m => m.hasRegistrationDates);
    const newKids = withNewKids.length
        ? withNewKids.reduce((s, m) => s + (m.newKids || 0), 0)
        : null;

    return {
        mandirCount: mandirStats.length,
        registered,
        sessions,
        latestWeek: latest,
        latestTotal,
        previousTotal,
        weekOverWeek: previousTotal > 0 ? (latestTotal - previousTotal) / previousTotal : null,
        reportingLatest,
        reportingRate: mandirStats.length ? reportingLatest / mandirStats.length : 0,
        avgConsistency,
        atRisk: mandirStats.filter(m => m.consistency < 0.25).length,
        newKids,
        newKidsCoverage: withNewKids.length,
        tierCounts: TIER_STEPS.reduce((acc, t) => {
            acc[t.label] = mandirStats.filter(m => m.tier === t.label).length;
            return acc;
        }, {}),
    };
}

/** Long-form rows for CSV export. */
export function statsToCsv(mandirStats, weeks) {
    const header = [
        'Mandir', 'Registered kids', 'Avg attendance', 'Tier', 'Sessions logged',
        'Weeks reported', 'Weeks in window', 'Consistency %', 'Current streak',
        'Longest streak', 'Last report', 'Weeks since report', 'New kids (window)',
        '4wk avg', 'Prior 4wk avg', 'Momentum %',
        ...weeks.map(w => w.label),
    ];

    const escape = (v) => {
        const s = v === null || v === undefined ? '' : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const rows = mandirStats.map(m => ([
        m.name, m.registeredKids, m.avgKids, m.tier, m.sessions,
        m.weeksReported, m.completedWeeks, Math.round(m.consistency * 100), m.currentStreak,
        m.longestStreak, formatMDY(m.lastReportDate), m.weeksSinceReport ?? '',
        m.newKids ?? '', m.recentAvg !== null ? Math.round(m.recentAvg) : '',
        m.priorAvg !== null ? Math.round(m.priorAvg) : '',
        m.momentum !== null ? Math.round(m.momentum * 100) : '',
        ...weeks.map(w => (m.weekly[w.key]?.sessions ? m.weekly[w.key].total : '')),
    ]));

    return [header, ...rows].map(r => r.map(escape).join(',')).join('\n');
}
