import { useState } from 'react';
import Icon from '../common/Icon';

function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

const TONES = ['coral', 'mint', 'lilac'];

function LeaderCard({ leaderInfo, isEditing, handleInputChange, handleSubmit, setIsEditing, tone }) {
    if (isEditing) {
        return (
            <div className="yd-card yd-leader">
                <form
                    className="yd-leader__form"
                    onSubmit={e => { e.preventDefault(); handleSubmit(); }}
                    noValidate
                >
                    <input
                        className="yd-input"
                        name="leaderName"
                        value={leaderInfo.leaderName}
                        onChange={handleInputChange}
                        placeholder="Name"
                        style={{ minHeight: 40, padding: '0.55rem 0.85rem' }}
                    />
                    <input
                        className="yd-input"
                        name="leaderEmail"
                        value={leaderInfo.leaderEmail}
                        onChange={handleInputChange}
                        placeholder="Email"
                        style={{ minHeight: 40, padding: '0.55rem 0.85rem' }}
                    />
                    <input
                        className="yd-input"
                        name="leaderPhone"
                        value={leaderInfo.leaderPhone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        style={{ minHeight: 40, padding: '0.55rem 0.85rem' }}
                    />
                    <div className="yd-leader__actions">
                        <button type="submit" className="yd-iconbtn yd-iconbtn--small" title="Save">
                            <Icon name="save" size={14} />
                        </button>
                        <button type="button" className="yd-iconbtn yd-iconbtn--small" onClick={() => setIsEditing(false)} title="Cancel">
                            <Icon name="close" size={14} />
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="yd-card yd-leader">
            <div className="yd-leader__top">
                <div
                    className={`yd-avatar yd-avatar--${tone}`}
                    style={{ width: 52, height: 52, fontSize: 20 }}
                >
                    {initials(leaderInfo.leaderName)}
                </div>
                <button className="yd-iconbtn yd-iconbtn--small" onClick={() => setIsEditing(true)} title="Edit">
                    <Icon name="edit" size={14} />
                </button>
            </div>
            <div className="yd-leader__name">{leaderInfo.leaderName || '—'}</div>
            <div className="yd-leader__role">{leaderInfo.leaderRole || 'Leader'}</div>
            {leaderInfo.leaderPhone && (
                <a className="yd-leader__phone" href={`tel:${leaderInfo.leaderPhone}`}>
                    <Icon name="phone" size={14} />
                    {leaderInfo.leaderPhone}
                </a>
            )}
            {leaderInfo.leaderEmail && (
                <a className="yd-leader__phone" href={`mailto:${leaderInfo.leaderEmail}`} style={{ marginTop: '0.4rem' }}>
                    <Icon name="send" size={14} />
                    {leaderInfo.leaderEmail}
                </a>
            )}
        </div>
    );
}

export default function LeaderContactSection({ leaders }) {
    return (
        <div className="yd-row yd-row--3" style={{ marginBottom: '1.25rem' }}>
            {leaders.map((leader, i) => (
                <LeaderCard key={i} {...leader} tone={TONES[i % TONES.length]} />
            ))}
        </div>
    );
}
