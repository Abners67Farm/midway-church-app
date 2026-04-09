'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [featuredSermon, setFeaturedSermon] = useState(null);
  const [featuredDevotion, setFeaturedDevotion] = useState(null);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  async function fetchHomepageData() {
    const { data: announcementData, error: announcementError } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (announcementError) {
      console.error('Announcement fetch error:', announcementError);
    } else {
      setAnnouncements(announcementData || []);
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: devotionData, error: devotionError } = await supabase
      .from('devotions')
      .select('*')
      .eq('is_published', true)
      .lte('publish_date', today)
      .order('publish_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1);

    if (devotionError) {
      console.error('Featured devotion fetch error:', devotionError);
    } else {
      setFeaturedDevotion(devotionData?.[0] || null);
    }

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(1);

    if (eventError) {
      console.error('Featured event fetch error:', eventError);
    } else {
      setFeaturedEvent(eventData?.[0] || null);
    }

    const { data: sermonData, error: sermonError } = await supabase
      .from('sermons')
      .select('*')
      .eq('is_active', true)
      .order('sermon_date', { ascending: false })
      .limit(1);

    if (sermonError) {
      console.error('Featured sermon fetch error:', sermonError);
    } else {
      setFeaturedSermon(sermonData?.[0] || null);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatShortDate(dateString) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getYouTubeThumbnail(url) {
    if (!url) return null;

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );

    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : null;
  }

  const sermonThumbnail =
    featuredSermon?.thumbnail_url ||
    getYouTubeThumbnail(featuredSermon?.youtube_url);

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-overlay">
          <p className="hero-eyebrow">Welcome to Midway Baptist Church</p>
          <h1 className="hero-title">A Place to Worship, Grow, and Connect</h1>
          <p className="hero-text">
            We are glad you are here. Join us as we grow in Christ, serve
            together, and help people take their next step of faith.
          </p>

          <div className="hero-actions">
            <Link href="/visit" className="hero-button">
              Plan Your Visit
            </Link>
          </div>

          <div className="hero-times">
            <span>Sunday School 10:00 AM</span>
            <span>Morning Worship 11:00 AM</span>
            <span>Wednesday Bible Study 6:30 PM</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Latest Sermon</h2>

        {!featuredSermon && <p>No sermons available yet.</p>}

        {featuredSermon && (
          <div className="featured-event-card">
            {sermonThumbnail && (
              <img
                src={sermonThumbnail}
                alt={featuredSermon.title}
                className="featured-event-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}

            <div className="featured-event-content">
              <h3>{featuredSermon.title}</h3>

              <p>
                <strong>Preacher:</strong> {featuredSermon.preacher}
              </p>

              {featuredSermon.sermon_date && (
                <p>
                  <strong>Date:</strong>{' '}
                  {formatShortDate(featuredSermon.sermon_date)}
                </p>
              )}

              {featuredSermon.scripture && (
                <p>
                  <strong>Scripture:</strong> {featuredSermon.scripture}
                </p>
              )}

              {featuredSermon.description && (
                <p className="featured-event-description">
                  {featuredSermon.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  marginTop: '0.75rem',
                }}
              >
                {featuredSermon.youtube_url && (
                  <a
                    href={featuredSermon.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="sermon-button"
                  >
                    Watch Sermon
                  </a>
                )}

                <Link href="/sermons" className="hero-button">
                  View All Sermons
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="home-section">
        <h2>Today's Devotion</h2>

        {!featuredDevotion && <p>No devotion available right now.</p>}

        {featuredDevotion && (
          <div className="card" style={{ maxWidth: '720px' }}>
            <p
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#1e73be',
                marginBottom: '0.5rem',
              }}
            >
              TODAY'S DEVOTION
            </p>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '0.75rem',
              }}
            >
              {formatShortDate(featuredDevotion.publish_date)}
            </p>

            <h3 style={{ marginTop: 0 }}>{featuredDevotion.title}</h3>

            <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>
            {featuredDevotion.scripture_reference}
              </p>

            {featuredDevotion.reflection && (
              <p style={{ marginTop: '0.5rem' }}>
                {featuredDevotion.reflection.length > 200
                  ? `${featuredDevotion.reflection.slice(0, 200)}...`
                  : featuredDevotion.reflection}
              </p>
            )}

            <div style={{ marginTop: '0.75rem' }}>
              <Link href="/devotions" className="hero-button">
                Read Full Devotion
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="home-section">
        <h2>Upcoming Event</h2>

        {!featuredEvent && <p>No upcoming events at this time.</p>}

        {featuredEvent && (
          <div className="featured-event-card">
            {featuredEvent.image_url && (
              <img
                src={featuredEvent.image_url}
                alt={featuredEvent.title}
                className="featured-event-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}

            <div className="featured-event-content">
              <h3 style={{ textTransform: 'capitalize' }}>
                {featuredEvent.title}
              </h3>

              <p>
                <strong>Date:</strong> {formatDate(featuredEvent.event_date)}
              </p>

              <p>
                <strong>Time:</strong> {featuredEvent.event_time}
              </p>

              {featuredEvent.location && (
                <p>
                  <strong>Location:</strong> {featuredEvent.location}
                </p>
              )}

              {featuredEvent.description && (
                <p className="featured-event-description">
                  {featuredEvent.description}
                </p>
              )}

              <Link href="/events" className="hero-button">
                View All Events
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="home-section">
        <h2>Announcements</h2>

        {announcements.length === 0 && (
          <p>No announcements at this time.</p>
        )}

        {announcements.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
}