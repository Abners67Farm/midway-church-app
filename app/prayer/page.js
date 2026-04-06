'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PrayerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.from('prayer_requests').insert([
      {
        name: formData.name,
        email: formData.email,
        request: formData.request,
      },
    ]);

    setLoading(false);

    if (error) {
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Supabase error:', error);
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      request: '',
    });
  }

  if (submitted) {
    return (
      <div className="page">
        <h1>Prayer Request</h1>
        <p>Thank you. Your prayer request has been received.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Prayer Request</h1>
      <p className="page-intro">
        Let us know how we can pray for you.
      </p>

      <form className="simple-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name (optional)</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email (optional)</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="request">Your Request</label>
        <textarea
          id="request"
          name="request"
          rows="5"
          placeholder="Share your prayer request..."
          required
          value={formData.request}
          onChange={handleChange}
        />

        {errorMessage && <p>{errorMessage}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Prayer Request'}
        </button>
      </form>
    </div>
  );
}