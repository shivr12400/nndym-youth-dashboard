export default function Icon({ name, size = 20, stroke = 2 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-left':  return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case 'home':        return <svg {...props}><path d="M3 12 12 3l9 9M5 10v10h14V10"/></svg>;
    case 'users':       return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'calendar':    return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>;
    case 'chart':       return <svg {...props}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/></svg>;
    case 'flag':        return <svg {...props}><path d="M4 22V4"/><path d="M4 4h14l-3 5 3 5H4"/></svg>;
    case 'plus':        return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'trophy':      return <svg {...props}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3"/></svg>;
    case 'sparkle':     return <svg {...props}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/></svg>;
    case 'phone':       return <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>;
    case 'check':       return <svg {...props}><path d="M20 6 9 17l-5-5"/></svg>;
    case 'edit':        return <svg {...props}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case 'menu':        return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'bell':        return <svg {...props}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case 'fire':        return <svg {...props}><path d="M8 14s1-3 4-5c0 0-1 4 1 5s4-1 4-5c0 0 4 4 4 8a7 7 0 1 1-14 0c0-1 .5-2 1-3Z"/></svg>;
    case 'send':        return <svg {...props}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>;
    case 'save':        return <svg {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>;
    case 'close':       return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'refresh':     return <svg {...props}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.8-3.3L23 10M1 14l4.7 4.3A9 9 0 0 0 20.5 15"/></svg>;
    case 'trash':       return <svg {...props}><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
    case 'logo':        return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="currentColor"/>
        <path d="M11 10v12M11 10l10 12M21 10v12" stroke="var(--cream)" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    );
    default: return null;
  }
}
