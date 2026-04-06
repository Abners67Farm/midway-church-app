'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Events fetch error:', error);
      return;
    }

    setEvents(data || []);
  }

  function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');

    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      day: date.getDate(),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  }

  return (
    <div className="page">
      <h1>Events</h1>
      <p className="page-intro">
        Stay up to date with what is happening at Midway Baptist Church.
      </p>

      {events.length === 0 && (
        <p>No upcoming events at this time.</p>
      )}

      <div className="events-list">
        {events.map((event) => {
          const formatted = formatDate(event.event_date);

          return (
            <div key={event.id} className="event-card">
              <div className="event-date-box">
                <span className="event-month">{formatted.month}</span>
                <span className="event-day">{formatted.day}</span>
              </div>

              <div className="event-content">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="event-image"
                  />
                )}

                <h2 style={{ textTransform: 'capitalize' }}>{event.title}</h2>

                <p className="event-full-date">{formatted.full}</p>

                <p><strong>Time:</strong> {event.event_time}</p>

                {event.location && (
                  <p><strong>Location:</strong> {event.location}</p>
                )}

                {event.description && (
                  <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}