"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminSermons() {
  const [sermons, setSermons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [preacher, setPreacher] = useState("");
  const [scripture, setScripture] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [sermonDate, setSermonDate] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    fetchSermons();
  }, []);

  async function fetchSermons() {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("sermon_date", { ascending: false });

    if (error) {
      console.error("Error fetching sermons:", error);
      return;
    }

    setSermons(data || []);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setPreacher("");
    setScripture("");
    setDescription("");
    setYoutubeUrl("");
    setThumbnailUrl("");
    setSermonDate("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title,
      preacher,
      scripture,
      description,
      youtube_url: youtubeUrl,
      thumbnail_url: thumbnailUrl,
      sermon_date: sermonDate,
    };

    if (editingId) {
      const { error } = await supabase
        .from("sermons")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating sermon:", error);
        alert("There was a problem updating the sermon.");
        return;
      }
    } else {
      const { error } = await supabase.from("sermons").insert([
        {
          ...payload,
          is_active: true,
        },
      ]);

      if (error) {
        console.error("Error adding sermon:", error);
        alert("There was a problem saving the sermon.");
        return;
      }
    }

    resetForm();
    fetchSermons();
  }

  function handleEdit(sermon) {
    setEditingId(sermon.id);
    setTitle(sermon.title || "");
    setPreacher(sermon.preacher || "");
    setScripture(sermon.scripture || "");
    setDescription(sermon.description || "");
    setYoutubeUrl(sermon.youtube_url || "");
    setThumbnailUrl(sermon.thumbnail_url || "");
    setSermonDate(sermon.sermon_date || "");

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function toggleSermon(id, currentStatus) {
    const { error } = await supabase
      .from("sermons")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating sermon status:", error);
      return;
    }

    fetchSermons();
  }

  async function deleteSermon(id) {
    const confirmed = window.confirm("Delete this sermon?");
    if (!confirmed) return;

    const { error } = await supabase.from("sermons").delete().eq("id", id);

    if (error) {
      console.error("Error deleting sermon:", error);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    fetchSermons();
  }

  function getThumbnail(url) {
    if (!url) return null;

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );

    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : null;
  }

  return (
    <section style={{ marginTop: "2.5rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Sermons</h2>

      <div
        ref={formRef}
        style={{
          background: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
          {editingId ? "Edit Sermon" : "Add Sermon"}
        </h3>

        {editingId && (
          <div
            style={{
              background: "#f5f7fb",
              border: "1px solid #d8e2f0",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            Editing: {title || "Untitled Sermon"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.9rem",
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Preacher"
              value={preacher}
              onChange={(e) => setPreacher(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Scripture"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              style={inputStyle}
            />

            <input
              type="date"
              value={sermonDate}
              onChange={(e) => setSermonDate(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              style={{ ...inputStyle, gridColumn: "1 / -1" }}
            />

            <input
              type="text"
              placeholder="Thumbnail URL (optional)"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              style={{ ...inputStyle, gridColumn: "1 / -1" }}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
                resize: "vertical",
                minHeight: "110px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <button type="submit" style={primaryButtonStyle}>
              {editingId ? "Update Sermon" : "Add Sermon"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={secondaryButtonStyle}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {sermons.map((s) => {
          const thumb = s.thumbnail_url || getThumbnail(s.youtube_url);

          return (
            <div
              key={s.id}
              style={{
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: thumb ? "240px 1fr" : "1fr",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                {thumb && (
                  <img
                    src={thumb}
                    alt={s.title}
                    style={{
                      width: "100%",
                      maxWidth: "240px",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                )}

                <div>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
                    {s.title}
                  </h3>

                  <p style={metaStyle}>
                    <strong>Preacher:</strong> {s.preacher || "—"}
                  </p>
                  <p style={metaStyle}>
                    <strong>Scripture:</strong> {s.scripture || "—"}
                  </p>
                  <p style={metaStyle}>
                    <strong>Date:</strong> {s.sermon_date || "—"}
                  </p>
                  <p style={metaStyle}>
                    <strong>Status:</strong> {s.is_active ? "Active" : "Hidden"}
                  </p>

                  {s.description && (
                    <p style={{ marginTop: "0.85rem", marginBottom: "1rem" }}>
                      {s.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleEdit(s)}
                      style={secondaryButtonStyle}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSermon(s.id, s.is_active)}
                      style={secondaryButtonStyle}
                    >
                      {s.is_active ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSermon(s.id)}
                      style={dangerButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const metaStyle = {
  margin: "0.35rem 0",
};

const primaryButtonStyle = {
  background: "#1e73be",
  color: "#fff",
  border: "none",
  padding: "0.7rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  background: "#f3f4f6",
  color: "#111",
  border: "1px solid #ccc",
  padding: "0.7rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
};

const dangerButtonStyle = {
  background: "#fff5f5",
  color: "#b42318",
  border: "1px solid #f1b0b7",
  padding: "0.7rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
};