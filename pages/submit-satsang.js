import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useKidsAttendance } from '../hooks/useKidsAttendance';
import { mandirs } from '../utils/mandirs';
import { getSessionToken } from '../utils/auth';
import { apiInfo } from '../utils/api';
import { calculateAge } from '../utils/activities';

// ── Helpers ────────────────────────────────────────────────────
function normalize(str) { return str.toLowerCase().replace(/[\s-]/g, ''); }
function isAdmin(email) { return email?.split('@')[0] === 'admin'; }
function getUserMandir(email) {
    if (!email) return null;
    const prefix = email.split('@')[0];
    return mandirs.find(m => normalize(m.mandirName) === normalize(prefix)) || null;
}
function todayMDY() {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}
function getKidAge(k) {
    const ageVal = k.age ?? k.Age;
    const n = parseInt(ageVal, 10);
    if (!isNaN(n)) return n;
    return calculateAge(k.birthday ?? k.Birthday);
}
function ageToLevel(age) {
    if (age <= 8)  return 'numberKidsFirstLevel';
    if (age <= 13) return 'numberKidsSecondLevel';
    if (age <= 18) return 'numberKidsThirdLevel';
    return 'numberKidsFourthLevel';
}
function kidInitials(name = '') {
    return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
}

// ── Inline SVG icons ───────────────────────────────────────────
function Icon({ name, size = 18 }) {
    const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    switch (name) {
        case 'arrow-left':  return <svg {...p}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
        case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
        case 'chart':       return <svg {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/></svg>;
        case 'users':       return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
        case 'check':       return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
        case 'plus':        return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
        case 'send':        return <svg {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>;
        default:            return null;
    }
}

// ── Data ───────────────────────────────────────────────────────
const AGE_LEVELS = [
    { key: 'numberKidsFirstLevel',  label: 'Ages 1–8',   sub: 'Little ones',  tone: 'mint'  },
    { key: 'numberKidsSecondLevel', label: 'Ages 9–13',  sub: 'Bal Mandal',   tone: 'sun'   },
    { key: 'numberKidsThirdLevel',  label: 'Ages 14–18', sub: 'Yuvak/Yuvati', tone: 'coral' },
    { key: 'numberKidsFourthLevel', label: 'Ages 19–25', sub: 'College+',     tone: 'lilac' },
];

const CLASS_LEVELS = [
    { key: 'satsangClass',    label: 'Satsang',    handlerKey: 'handleChangeSC' },
    { key: 'balMandalClass',  label: 'Bal Mandal', handlerKey: 'handleChangeBMC' },
    { key: 'kirtanClass',     label: 'Kirtan',     handlerKey: 'handleChangeKC' },
    { key: 'instrumentClass', label: 'Instrument', handlerKey: 'handleChangeIC' },
    { key: 'danceClass',      label: 'Dance',      handlerKey: 'handleChangeDC' },
];

const AVATAR_TONES = ['coral', 'mint', 'lilac', 'sun', 'rose', 'sage', 'sky'];

// ── Counter card ───────────────────────────────────────────────
function Counter({ label, sub, tone, value, onInc, onDec }) {
    return (
        <div className={`yd-counter yd-counter--${tone}`}>
            <div className="yd-counter__lbl">{label}</div>
            <div className="yd-counter__sub">{sub}</div>
            <div className="yd-counter__row">
                <button type="button" className="yd-counter__btn" onClick={onDec} aria-label={`decrease ${label}`}>−</button>
                <div className="yd-counter__val">{value}</div>
                <button type="button" className="yd-counter__btn" onClick={onInc} aria-label={`increase ${label}`}>+</button>
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────
export default function SubmitSatsang({ isAuthenticated, userEmail }) {
    const router = useRouter();
    const admin = isAdmin(userEmail);
    const detectedMandir = getUserMandir(userEmail);

    // If non-admin, auto-select mandir; admin must pick first
    const [selectedMandir, setSelectedMandir] = useState(
        !admin && detectedMandir ? detectedMandir.mandirName : ''
    );

    const hook = useKidsAttendance(isAuthenticated);
    const {
        satsangCount, handleInputChangeSatsangCount,
        handleSubmitSatsangCount, handleAnotherSubmitSatsangCount,
        handleChangeBMC, handleChangeSC, handleChangeKC, handleChangeIC, handleChangeDC,
        balMandalClass, satsangClass, kirtanClass, instrumentClass, danceClass,
        error, open: submitted, dateError,
    } = hook;

    const classHandlers = { handleChangeBMC, handleChangeSC, handleChangeKC, handleChangeIC, handleChangeDC };
    const classValues   = { satsangClass, balMandalClass, kirtanClass, instrumentClass, danceClass };

    // Keep satsangCount.mandirName in sync + pre-fill date
    useEffect(() => {
        if (selectedMandir) {
            handleInputChangeSatsangCount({ target: { name: 'mandirName', value: selectedMandir } });
        }
        handleInputChangeSatsangCount({ target: { name: 'date', value: todayMDY() } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMandir]);

    // ── Mode & roster state ──────────────────────────────────
    const [mode, setMode] = useState('count'); // 'count' | 'roster'
    const [picked, setPicked] = useState({});
    const [kids, setKids] = useState([]);
    const [kidsLoading, setKidsLoading] = useState(false);

    const fetchKids = useCallback(async (mandirName) => {
        if (!mandirName) return;
        setKidsLoading(true);
        try {
            const token = await getSessionToken();
            if (!token) return;
            const res = await fetch(
                `${apiInfo.kids_list.get}?mandirName=${encodeURIComponent(mandirName)}`,
                { headers: { Authorization: token, 'Content-Type': 'application/json' } }
            );
            if (!res.ok) return;
            const json = await res.json();
            const list = json?.kids || json?.kids_list || json?.data || [];
            setKids(Array.isArray(list) ? list : []);
        } catch { /* non-fatal */ }
        finally { setKidsLoading(false); }
    }, []);

    useEffect(() => {
        if (mode === 'roster' && selectedMandir) fetchKids(selectedMandir);
    }, [mode, selectedMandir, fetchKids]);

    // ── Counts ───────────────────────────────────────────────
    const rosterCounts = useMemo(() => {
        const c = { numberKidsFirstLevel: 0, numberKidsSecondLevel: 0, numberKidsThirdLevel: 0, numberKidsFourthLevel: 0 };
        kids.forEach(k => { if (picked[k.name ?? k.Name]) c[ageToLevel(getKidAge(k))]++; });
        return c;
    }, [picked, kids]);

    const effectiveCounts = mode === 'roster' ? rosterCounts : {
        numberKidsFirstLevel:  Number(satsangCount.numberKidsFirstLevel)  || 0,
        numberKidsSecondLevel: Number(satsangCount.numberKidsSecondLevel) || 0,
        numberKidsThirdLevel:  Number(satsangCount.numberKidsThirdLevel)  || 0,
        numberKidsFourthLevel: Number(satsangCount.numberKidsFourthLevel) || 0,
    };
    const total = Object.values(effectiveCounts).reduce((a, b) => a + b, 0);

    const setCount = (key, val) => {
        handleInputChangeSatsangCount({ target: { name: key, value: Math.max(0, val) } });
    };

    const toggleKid = (name) => setPicked(p => ({ ...p, [name]: !p[name] }));
    const pickedCount = kids.filter(k => picked[k.name ?? k.Name]).length;
    const allSelected = kids.length > 0 && kids.every(k => picked[k.name ?? k.Name]);

    // Sync roster counts into satsangCount before submit
    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (mode === 'roster') {
            Object.entries(rosterCounts).forEach(([k, v]) => {
                handleInputChangeSatsangCount({ target: { name: k, value: v } });
            });
            // Small defer to let state update propagate
            await new Promise(r => setTimeout(r, 0));
        }
        await handleSubmitSatsangCount(e);
    };

    const valid = satsangCount.reporter?.trim() && /^\d{2}\/\d{2}\/\d{4}$/.test(satsangCount.date) && total > 0;

    // ── Admin mandir picker ──────────────────────────────────
    if (admin && !selectedMandir) {
        return (
            <Layout>
                <div className="yd-main">
                    <div style={{ maxWidth: 640, margin: '0 auto' }}>
                        <button className="yd-backlink" onClick={() => router.push('/')}>
                            <Icon name="arrow-left" size={16} /> Back to home
                        </button>
                        <div className="yd-card yd-mandirpicker">
                            <h1>Log Satsang</h1>
                            <p>Select the mandir you&apos;re logging for.</p>
                            <div className="yd-mandirs" style={{ justifyContent: 'flex-start' }}>
                                {mandirs.map(m => (
                                    <button
                                        key={m.mandirName}
                                        className="yd-mandir-btn"
                                        onClick={() => setSelectedMandir(m.mandirName)}
                                    >
                                        {m.mandirName} <Icon name="arrow-right" size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // ── Success state ────────────────────────────────────────
    if (submitted) {
        const payload = {
            mandirName: satsangCount.mandirName,
            date: satsangCount.date,
            reporter: satsangCount.reporter,
            ...effectiveCounts,
            satsangClass, balMandalClass, kirtanClass, instrumentClass, danceClass,
        };
        return (
            <Layout>
                <div className="yd-main">
                    <div className="yd-page--narrow">
                        <div className="yd-card yd-submit">
                            <div className="yd-success">
                                <div className="yd-success__check">
                                    <Icon name="check" size={36} />
                                </div>
                                <h2>Logged · {total} kids</h2>
                                <p>Thanks, {satsangCount.reporter}. Submitted for {satsangCount.date}.</p>
                                <pre className="yd-payload">{JSON.stringify(payload, null, 2)}</pre>
                                <div className="yd-submit__actions" style={{ justifyContent: 'center' }}>
                                    <button className="yd-btn yd-btn--ghost" onClick={() => { handleAnotherSubmitSatsangCount(); setPicked({}); }}>
                                        Log another
                                    </button>
                                    <button className="yd-btn yd-btn--primary" onClick={() => router.push('/')}>
                                        Back to home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // ── Main form ────────────────────────────────────────────
    return (
        <Layout>
            <div className="yd-main">
                <div className="yd-page--narrow">
                    <button className="yd-backlink" onClick={() => router.push('/')}>
                        <Icon name="arrow-left" size={16} /> Back to home
                    </button>

                    <div className="yd-card yd-submit">
                        <div className="yd-submit__eyebrow">
                            Log satsang · {selectedMandir} Mandir
                        </div>
                        <h1 className="yd-submit__title">How was satsang?</h1>
                        <p className="yd-submit__sub">Pick how you want to log attendance.</p>

                        {/* Mode tabs */}
                        <div className="yd-modetabs" role="tablist">
                            <button
                                role="tab" aria-selected={mode === 'count'}
                                className={`yd-modetab ${mode === 'count' ? 'is-active' : ''}`}
                                onClick={() => setMode('count')}
                            >
                                <Icon name="chart" size={16} /> Count by age group
                            </button>
                            <button
                                role="tab" aria-selected={mode === 'roster'}
                                className={`yd-modetab ${mode === 'roster' ? 'is-active' : ''}`}
                                onClick={() => setMode('roster')}
                            >
                                <Icon name="users" size={16} /> Pick from roster
                            </button>
                        </div>

                        {/* Date + Reporter */}
                        <div className="yd-submit__row2">
                            <div>
                                <label htmlFor="sc-date" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.95rem' }}>Date</label>
                                <input
                                    id="sc-date"
                                    className={`yd-input ${dateError ? 'yd-input--error' : ''}`}
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="MM/DD/YYYY"
                                    name="date"
                                    value={satsangCount.date}
                                    onChange={handleInputChangeSatsangCount}
                                />
                                {dateError && <div className="yd-input__hint">{dateError}</div>}
                            </div>
                            <div>
                                <label htmlFor="sc-reporter" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.95rem' }}>Reported by</label>
                                <input
                                    id="sc-reporter"
                                    className="yd-input"
                                    type="text"
                                    placeholder="Your name"
                                    name="reporter"
                                    value={satsangCount.reporter}
                                    onChange={handleInputChangeSatsangCount}
                                />
                            </div>
                        </div>

                        {/* Attendance input */}
                        <div className="yd-submit__field">
                            <label>{mode === 'count' ? 'Kids by age group' : 'Who came today?'}</label>

                            {mode === 'count' ? (
                                <div className="yd-agegrid">
                                    {AGE_LEVELS.map(lvl => (
                                        <Counter
                                            key={lvl.key}
                                            label={lvl.label}
                                            sub={lvl.sub}
                                            tone={lvl.tone}
                                            value={Number(satsangCount[lvl.key]) || 0}
                                            onInc={() => setCount(lvl.key, (Number(satsangCount[lvl.key]) || 0) + 1)}
                                            onDec={() => setCount(lvl.key, (Number(satsangCount[lvl.key]) || 0) - 1)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="yd-rosterpick__bar">
                                        <span className="yd-rosterpick__count">
                                            <strong>{pickedCount}</strong> of {kids.length} selected
                                        </span>
                                        <button
                                            type="button"
                                            className="yd-linkbtn"
                                            onClick={() => {
                                                if (allSelected) setPicked({});
                                                else setPicked(Object.fromEntries(kids.map(k => [k.name ?? k.Name, true])));
                                            }}
                                        >
                                            {allSelected ? 'Clear all' : 'Select all'}
                                        </button>
                                    </div>

                                    <div className="yd-rosterpick">
                                        {kidsLoading ? (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ink-3)', fontSize: '0.9rem' }}>
                                                Loading roster…
                                            </div>
                                        ) : kids.length === 0 ? (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ink-3)', fontSize: '0.9rem' }}>
                                                No kids registered yet.
                                            </div>
                                        ) : (
                                            kids.map((k, i) => {
                                                const name = k.name ?? k.Name ?? '';
                                                const age = getKidAge(k);
                                                const isOn = !!picked[name];
                                                const tone = AVATAR_TONES[i % AVATAR_TONES.length];
                                                return (
                                                    <button
                                                        key={name + i}
                                                        type="button"
                                                        className={`yd-pickrow ${isOn ? 'is-on' : ''}`}
                                                        onClick={() => toggleKid(name)}
                                                    >
                                                        <span className="yd-pickrow__box">
                                                            {isOn && <Icon name="check" size={13} />}
                                                        </span>
                                                        <div className={`yd-avatar yd-avatar--${tone}`} style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
                                                            {kidInitials(name)}
                                                        </div>
                                                        <div>
                                                            <div className="yd-pickrow__name">{name}</div>
                                                            <div className="yd-pickrow__meta">Age {age > 0 ? age : '?'}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}

                                        {/* Missing a kid? */}
                                        <button
                                            type="button"
                                            className="yd-pickrow yd-pickrow--add"
                                            onClick={() => router.push('/register')}
                                        >
                                            <span className="yd-pickrow__add-box">
                                                <Icon name="plus" size={13} />
                                            </span>
                                            <div>
                                                <div className="yd-pickrow__name">Missing a kid?</div>
                                                <div className="yd-pickrow__meta">Tap to register them now</div>
                                            </div>
                                            <Icon name="arrow-right" size={16} />
                                        </button>
                                    </div>

                                    {/* Live breakdown buckets */}
                                    <div className="yd-roster-breakdown">
                                        {AGE_LEVELS.map(lvl => (
                                            <div key={lvl.key} className={`yd-bucket yd-bucket--${lvl.tone}`}>
                                                <div className="yd-bucket__num">{rosterCounts[lvl.key]}</div>
                                                <div className="yd-bucket__lbl">{lvl.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Total */}
                        <div className="yd-submit__total">
                            <span>Total kids</span>
                            <strong>{total}</strong>
                        </div>

                        {/* Class chips */}
                        <div className="yd-submit__field">
                            <label>Which classes ran today?</label>
                            <div className="yd-checks">
                                {CLASS_LEVELS.map(c => {
                                    const isOn = classValues[c.key];
                                    const handler = classHandlers[c.handlerKey];
                                    return (
                                        <button
                                            key={c.key}
                                            type="button"
                                            className={`yd-check ${isOn ? 'is-on' : ''}`}
                                            onClick={() => handler({ target: { checked: !isOn } })}
                                        >
                                            <span className="yd-check__box">
                                                {isOn && <Icon name="check" size={11} />}
                                            </span>
                                            {c.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <div style={{ color: 'oklch(0.55 0.15 20)', fontSize: '0.9rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: 'oklch(0.96 0.04 20)', borderRadius: 12, border: '1px solid oklch(0.88 0.08 20)' }}>
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="yd-submit__actions">
                            <button type="button" className="yd-btn yd-btn--ghost" onClick={() => router.push('/')}>
                                Cancel
                            </button>
                            <button type="button" className="yd-btn yd-btn--primary" onClick={handleSubmit} disabled={!valid}>
                                <Icon name="send" size={16} /> Submit count
                            </button>
                        </div>
                        {!valid && (
                            <p className="yd-submit__hint">Add a date, your name, and at least one kid to submit.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
