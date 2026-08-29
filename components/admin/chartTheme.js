/**
 * Chart palette for the admin overview.
 *
 * SERIES is the validated categorical order — it clears the lightness band,
 * chroma floor, adjacent CVD ΔE (worst 9.1) and normal-vision ΔE (worst 19.6)
 * gates against this app's white card surface. Do not reorder it: the ordering
 * *is* the colour-blind-safety mechanism. Three slots (aqua, yellow, magenta)
 * sit below 3:1 contrast on white, so every chart using them also ships a table
 * view or visible labels.
 *
 * Never generate a 9th hue. Mandirs past slot 8 render in CONTEXT grey and are
 * identified by hover, small multiples, and the reporting grid.
 */
export const SERIES = [
    '#2a78d6', // blue
    '#eb6834', // orange
    '#1baf7a', // aqua
    '#eda100', // yellow
    '#e87ba4', // magenta
    '#008300', // green
    '#4a3aa7', // violet
    '#e34948', // red
];

export const SERIES_CAP = SERIES.length;

/** Ordered age bands get a single-hue ramp, light → dark. */
export const ORDINAL_BLUE = ['#86b6ef', '#3987e5', '#256abf', '#104281'];

/** Reserved for state only — never used as a series colour. */
export const STATUS = {
    good: '#0ca30c',
    warning: '#fab219',
    serious: '#ec835a',
    critical: '#d03b3b',
};

export const CHROME = {
    surface: '#ffffff',
    grid: '#E8E1D6',
    axis: '#C7BDAE',
    muted: '#8A8175',
    ink: '#231A11',
    ink2: '#5A4A3A',
    context: '#D3CBBD',   // unhighlighted lines
    emphasis: '#231A11',  // hover highlight
};

export function seriesColor(rank) {
    return rank < SERIES_CAP ? SERIES[rank] : CHROME.context;
}

export function statusColor(status) {
    return STATUS[status] || CHROME.muted;
}
