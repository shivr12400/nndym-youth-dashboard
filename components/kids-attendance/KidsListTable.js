import Icon from '../common/Icon';

const TONES = ['coral', 'mint', 'lilac', 'sun', 'rose', 'sage', 'sky'];

function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function KidsListTable({ kidsList, onRegister }) {
    return (
        <div>
            <div className="yd-sec" style={{ marginBottom: '1.25rem' }}>
                <div className="yd-sec__left">
                    <span className="yd-sec__icon"><Icon name="users" size={20} /></span>
                    <div>
                        <div className="yd-sec__title">Yuvaks &amp; Yuvatis</div>
                        <div className="yd-sec__sub">{kidsList.length} kids in your satsang class</div>
                    </div>
                </div>
                {onRegister && (
                    <button
                        className="yd-btn yd-btn--primary"
                        style={{ padding: '0.6rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                        onClick={onRegister}
                    >
                        <Icon name="plus" size={15} />
                        <span>Register kid</span>
                    </button>
                )}
            </div>

            <div className="yd-card">
                {kidsList.length === 0 ? (
                    <p style={{ color: 'var(--ink-3)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
                        No kids registered yet.
                    </p>
                ) : (
                    <div className="yd-roster">
                        {kidsList.map((kid, i) => (
                            <div key={kid.id || i} className="yd-roster__row">
                                <div
                                    className={`yd-avatar yd-avatar--${TONES[i % TONES.length]}`}
                                    style={{ width: 40, height: 40, fontSize: 14 }}
                                >
                                    {initials(kid.name)}
                                </div>
                                <div>
                                    <div className="yd-roster__n">{kid.name}</div>
                                </div>
                                <a className="yd-roster__phone" href={`tel:${kid.phone}`}>
                                    <Icon name="phone" size={13} />
                                    {kid.phone}
                                </a>
                                <a className="yd-roster__email" href={`mailto:${kid.email}`}>
                                    {kid.email}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
