'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSermons from '@/components/AdminSermons';

export default function AdminPage() {
  const [prayers, setPrayers] = useState([]);
  const [connects, setConnects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: prayerData } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: connectData } = await supabase
      .from('connect_cards')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: announcementData } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    setPrayers(prayerData || []);
    setConnects(connectData || []);
    setAnnouncements(announcementData || []);
    setEvents(eventData || []);
  }

  function resetEventForm() {
    setEditingEventId(null);
    setEventForm({
      title: '',
      event_date: '',
      event_time: '',
      location: '',
      description: '',
      image_url: '',
    });
    setUploading(false);
  }

  async function toggleContacted(id, currentStatus) {
    await supabase
      .from('connect_cards')
      .update({ contacted: !currentStatus })
      .eq('id', id);

    fetchData();
  }

  async function handleAnnouncementSubmit(e) {
    e.preventDefault();

    await supabase.from('announcements').insert([
      {
        title: announcementForm.title,
        content: announcementForm.content,
        is_active: true,
      },
    ]);

    setAnnouncementForm({ title: '', content: '' });
    fetchData();
  }

  async function toggleAnnouncement(id, currentStatus) {
    await supabase
      .from('announcements')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    fetchData();
  }

  async function deleteAnnouncement(id) {
    await supabase.from('announcements').delete().eq('id', id);
    fetchData();
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file);

    if (error) {
      alert('Upload failed');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    setEventForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
  }

  async function handleEventSubmit(e) {
    e.preventDefault();

    if (editingEventId) {
      await supabase
        .from('events')
        .update({
          ...eventForm,
        })
        .eq('id', editingEventId);
    } else {
      await supabase.from('events').insert([
        {
          ...eventForm,
          is_active: true,
        },
      ]);
    }

    resetEventForm();
    fetchData();
  }

  function handleEditEvent(event) {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title || '',
      event_date: event.event_date || '',
      event_time: event.event_time || '',
      location: event.location || '',
      description: event.description || '',
      image_url: event.image_url || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleEvent(id, currentStatus) {
    await supabase
      .from('events')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    fetchData();
  }

  async function deleteEvent(id) {
    await supabase.from('events').delete().eq('id', id);

    if (editingEventId === id) {
      resetEventForm();
    }

    fetchData();
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Announcements</h2>

        <form onSubmit={handleAnnouncementSubmit} style={formCardStyle}>
          <div style={gridTwoStyle}>
            <input
              type="text"
              placeholder="Title"
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <textarea
              placeholder="Content"
              value={announcementForm.content}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  content: e.target.value,
                })
              }
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" style={primaryButtonStyle}>
              Add Announcement
            </button>
          </div>
        </form>

        <div style={stackStyle}>
          {announcements.map((a) => (
            <div key={a.id} style={itemCardStyle}>
              <h3 style={{ marginTop: 0 }}>{a.title}</h3>
              <p>{a.content}</p>

              <div style={actionRowStyle}>
                <button
                  type="button"
                  onClick={() => toggleAnnouncement(a.id, a.is_active)}
                  style={secondaryButtonStyle}
                >
                  {a.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteAnnouncement(a.id)}
                  style={dangerButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Events</h2>

        <form onSubmit={handleEventSubmit} style={formCardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
            {editingEventId ? 'Edit Event' : 'Add Event'}
          </h3>

          {editingEventId && (
            <div
              style={{
                background: '#f5f7fb',
                border: '1px solid #d8e2f0',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Editing: {eventForm.title || 'Untitled Event'}
            </div>
          )}

          <div style={gridFourStyle}>
            <input
              type="text"
              placeholder="Title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              required
              style={inputStyle}
            />

            <input
              type="date"
              value={eventForm.event_date}
              onChange={(e) =>
                setEventForm({ ...eventForm, event_date: e.target.value })
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Time"
              value={eventForm.event_time}
              onChange={(e) =>
                setEventForm({ ...eventForm, event_time: e.target.value })
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Location"
              value={eventForm.location}
              onChange={(e) =>
                setEventForm({ ...eventForm, location: e.target.value })
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              rows={4}
              style={{
                ...inputStyle,
                gridColumn: '1 / -1',
                resize: 'vertical',
                minHeight: '110px',
              }}
            />
          </div>

          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <input type="file" onChange={handleImageUpload} />

            {uploading && <p style={{ margin: 0 }}>Uploading...</p>}

            <button type="submit" style={primaryButtonStyle}>
              {editingEventId ? 'Update Event' : 'Add Event'}
            </button>

            {editingEventId && (
              <button
                type="button"
                onClick={resetEventForm}
                style={secondaryButtonStyle}
              >
                Cancel Edit
              </button>
            )}
          </div>

          {eventForm.image_url && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
                Current Image Preview
              </p>
              <img
                src={eventForm.image_url}
                alt="Event preview"
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </div>
          )}
        </form>

        <div style={stackStyle}>
          {events.map((event) => (
            <div key={event.id} style={itemCardStyle}>
              <h3 style={{ marginTop: 0, textTransform: 'capitalize' }}>
                {event.title}
              </h3>

              <div style={metaBlockStyle}>
                {event.event_date && (
                  <p style={metaTextStyle}>
                    <strong>Date:</strong> {event.event_date}
                  </p>
                )}
                {event.event_time && (
                  <p style={metaTextStyle}>
                    <strong>Time:</strong> {event.event_time}
                  </p>
                )}
                {event.location && (
                  <p style={metaTextStyle}>
                    <strong>Location:</strong> {event.location}
                  </p>
                )}
                <p style={metaTextStyle}>
                  <strong>Status:</strong> {event.is_active ? 'Active' : 'Hidden'}
                </p>
              </div>

              {event.description && <p>{event.description}</p>}

              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    borderRadius: '8px',
                    display: 'block',
                    marginTop: '0.75rem',
                  }}
                />
              )}

              <div style={actionRowStyle}>
                <button
                  type="button"
                  onClick={() => handleEditEvent(event)}
                  style={secondaryButtonStyle}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => toggleEvent(event.id, event.is_active)}
                  style={secondaryButtonStyle}
                >
                  {event.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteEvent(event.id)}
                  style={dangerButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Connect Cards</h2>

        <div style={stackStyle}>
          {connects.map((c) => (
            <div key={c.id} style={itemCardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                {c.name || 'No name'}
              </h3>

              <div style={metaBlockStyle}>
                {c.email && (
                  <p style={metaTextStyle}>
                    <strong>Email:</strong> {c.email}
                  </p>
                )}
                {c.phone && (
                  <p style={metaTextStyle}>
                    <strong>Phone:</strong> {c.phone}
                  </p>
                )}
              </div>

              {c.message && <p>{c.message}</p>}

              <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
                Status: {c.contacted ? 'Contacted' : 'Not Contacted'}
              </p>

              <div style={actionRowStyle}>
                <button
                  type="button"
                  onClick={() => toggleContacted(c.id, c.contacted)}
                  style={secondaryButtonStyle}
                >
                  {c.contacted ? 'Mark Uncontacted' : 'Mark Contacted'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Prayer Requests</h2>

        <div style={stackStyle}>
          {prayers.map((p) => (
            <div key={p.id} style={itemCardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                {p.name || 'Anonymous'}
              </h3>
              <p style={{ marginBottom: 0 }}>{p.request}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <AdminSermons />
      </section>
    </div>
  );
}

const sectionStyle = {
  marginBottom: '2.5rem',
};

const sectionTitleStyle = {
  marginBottom: '1rem',
};

const formCardStyle = {
  background: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const itemCardStyle = {
  background: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const stackStyle = {
  display: 'grid',
  gap: '1rem',
};

const gridTwoStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '0.9rem',
};

const gridFourStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.9rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const actionRowStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginTop: '1rem',
};

const metaBlockStyle = {
  display: 'grid',
  gap: '0.25rem',
  marginBottom: '0.75rem',
};

const metaTextStyle = {
  margin: 0,
};

const primaryButtonStyle = {
  background: '#1e73be',
  color: '#fff',
  border: 'none',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const secondaryButtonStyle = {
  background: '#f3f4f6',
  color: '#111',
  border: '1px solid #ccc',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
};

const dangerButtonStyle = {
  background: '#fff5f5',
  color: '#b42318',
  border: '1px solid #f1b0b7',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
};