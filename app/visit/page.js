'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function VisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

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

    const { error } = await supabase.from('connect_cards').insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error('Connect form error:', error);
      setErrorMessage(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page">
        <h1>Thanks for Connecting!</h1>
        <p>We’re glad you reached out. Someone will follow up soon.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Plan Your Visit</h1>
      <p className="page-intro">
        We would love to meet you. Let us know you're coming!
      </p>

      <form className="simple-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>How can we help you?</label>
        <textarea
          rows="4"
          name="message"
          placeholder="Questions, needs, or plans..."
          value={formData.message}
          onChange={handleChange}
        />

        {errorMessage && <p>{errorMessage}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}