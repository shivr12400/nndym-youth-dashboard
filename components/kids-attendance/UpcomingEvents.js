import { useState } from 'react';
import Icon from '../common/Icon';

function parseEventDate(dateStr) {
    if (!dateStr) return { day: '—', mon: '' };
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const mon = months[parseInt(parts[0], 10) - 1] || '';
        return { day: parts[1], mon };
    }
    return { day: dateStr, mon: '' };
}

export default function UpcomingEvents({
    upcomingEvents = [],
    eventForm = {},
    handleInputChangeEvents,
    handleEventsDateBlur,
    handleSubmitEvents,
    handleDeleteEvent,
    handleAnotherSubmitEvents,
    handleRefreshPage,
    openEvents,
    eventsDateError,
}) {
    const [addOpen, setAddOpen] = useState(false);

    return (
        <div>
            <div className="yd-sec" style={{ marginBottom: '1.25rem' }}>
                <div className="yd-sec__left">
                    <span className="yd-sec__icon"><Icon name="calendar" size={20} /></span>
                    <div>
                        <div className="yd-sec__title">Upcoming events</div>
                        <div className="yd-sec__sub">What's coming up at the mandir</div>
                    </div>
                </div>
                <button
                    className={`yd-btn ${addOpen ? 'yd-btn--ghost' : 'yd-btn--primary'}`}
                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}
                    onClick={() => setAddOpen(o => !o)}
                >
                    <Icon name={addOpen ? 'close' : 'plus'} size={15} />
                    <span>{addOpen ? 'Cancel' : 'Add event'}</span>
                </button>
            </div>

            {addOpen && (
                <div className="yd-card yd-evform" style={{ marginBottom: '1rem' }}>
                    <form onSubmit={e => { handleSubmitEvents(e); if (openEvents) setAddOpen(false); }} noValidate>
                        <div className="yd-evform__row" style={{ marginBottom: '0.85rem' }}>
                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                <label>Event name</label>
                                <input
                                    className="yd-input"
                                    name="upcomingEvents"
                                    value={eventForm.upcomingEvents || ''}
                                    onChange={handleInputChangeEvents}
                                    placeholder="e.g. Janmashtami Celebration"
                                    required
                                />
                            </div>
                            <div className="yd-submit__field" style={{ marginBottom: 0 }}>
                                <label>Date</label>
                                <input
                                    className={`yd-input${eventsDateError ? ' yd-input--error' : ''}`}
                                    name="date"
                                    value={eventForm.date || ''}
                                    onChange={handleInputChangeEvents}
                                    onBlur={handleEventsDateBlur}
                                    placeholder="MM/DD/YYYY"
                                    required
                                />
                                {eventsDateError && <p className="yd-input__hint">{eventsDateError}</p>}
                            </div>
                        </div>
                        <div className="yd-submit__actions">
                            {openEvents && (
                                <button type="button" className="yd-btn yd-btn--ghost" onClick={handleAnotherSubmitEvents}
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}>
                                    Submit another
                                </button>
                            )}
                            {openEvents && (
                                <button type="button" className="yd-btn yd-btn--ghost" onClick={handleRefreshPage}
                                    style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}>
                                    <Icon name="refresh" size={15} />
                                    <span>Refresh</span>
                                </button>
                            )}
                            <button type="submit" className="yd-btn yd-btn--primary"
                                style={{ padding: '0.65rem 1.1rem', minHeight: 40, fontSize: '0.88rem' }}>
                                <Icon name="check" size={15} />
                                <span>{openEvents ? 'Saved!' : 'Add to calendar'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="yd-card">
                {upcomingEvents.length === 0 ? (
                    <p style={{ color: 'var(--ink-3)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
                        No upcoming events — add one above.
                    </p>
                ) : (
                    <div className="yd-events">
                        {upcomingEvents.map((event, i) => {
                            const { day, mon } = parseEventDate(event.date);
                            return (
                                <div key={event.id ?? i} className="yd-event">
                                    <div className="yd-event__date">
                                        <div className="yd-event__day">{day}</div>
                                        <div className="yd-event__mon">{mon}</div>
                                    </div>
                                    <div className="yd-event__body">
                                        <div className="yd-event__title">{event.upcomingEvents}</div>
                                        <div className="yd-event__meta">{event.date}</div>
                                    </div>
                                    <button
                                        className="yd-event__del"
                                        onClick={() => handleDeleteEvent(event)}
                                        aria-label="Delete event"
                                    >
                                        <Icon name="trash" size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
