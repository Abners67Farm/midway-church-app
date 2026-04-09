"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDevotions() {
  const [devotions, setDevotions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [scriptureReference, setScriptureReference] = useState("");
  const [scriptureText, setScriptureText] = useState("");
  const [reflection, setReflection] = useState("");
  const [prayer, setPrayer] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const formRef = useRef(null);

  useEffect(() => {
    fetchDevotions();
  }, []);

  async function fetchDevotions() {
    const { data, error } = await supabase
      .from("devotions")
      .select("*")
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching devotions:", error);
      return;
    }

    setDevotions(data || []);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setScriptureReference("");
    setScriptureText("");
    setReflection("");
    setPrayer("");
    setPublishDate("");
    setIsPublished(true);
  }

  async function unpublishOtherDevotionsForDate(date, currentId = null) {
    if (!date) return;

    let query = supabase
      .from("devotions")
      .update({ is_published: false })
      .eq("publish_date", date)
      .eq("is_published", true);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { error } = await query;

    if (error) {
      console.error("Error unpublishing other devotions:", error);
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title,
      scripture_reference: scriptureReference,
      scripture_text: scriptureText,
      reflection,
      prayer,
      publish_date: publishDate,
      is_published: isPublished,
    };

    if (editingId) {
      if (isPublished) {
        await unpublishOtherDevotionsForDate(publishDate, editingId);
      }

      const { error } = await supabase
        .from("devotions")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating devotion:", error);
        alert("There was a problem updating the devotion.");
        return;
      }
    } else {
      if (isPublished) {
        await unpublishOtherDevotionsForDate(publishDate);
      }

      const { error } = await supabase.from("devotions").insert([payload]);

      if (error) {
        console.error("Error adding devotion:", error);
        alert("There was a problem saving the devotion.");
        return;
      }
    }

    resetForm();
    fetchDevotions();
  }

  function handleEdit(devotion) {
    setEditingId(devotion.id);
    setTitle(devotion.title || "");
    setScriptureReference(devotion.scripture_reference || "");
    setScriptureText(devotion.scripture_text || "");
    setReflection(devotion.reflection || "");
    setPrayer(devotion.prayer || "");
    setPublishDate(devotion.publish_date || "");
    setIsPublished(devotion.is_published ?? true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function togglePublished(id, currentStatus, devotionDate) {
    if (!currentStatus) {
      await unpublishOtherDevotionsForDate(devotionDate, id);
    }

    const { error } = await supabase
      .from("devotions")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating devotion status:", error);
      return;
    }

    fetchDevotions();
  }

  async function deleteDevotion(id) {
    const confirmed = window.confirm("Delete this devotion?");
    if (!confirmed) return;

    const { error } = await supabase.from("devotions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting devotion:", error);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    fetchDevotions();
  }

  return (
    <section style={{ marginTop: "2.5rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Devotions</h2>

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
          {editingId ? "Edit Devotion" : "Add Devotion"}
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
            Editing: {title || "Untitled Devotion"}
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
              style={{ ...inputStyle, gridColumn: "1 / -1" }}
            />

            <input
              type="text"
              placeholder="Scripture Reference"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
              style={inputStyle}
            />

            <textarea
              placeholder="Scripture Text"
              value={scriptureText}
              onChange={(e) => setScriptureText(e.target.value)}
              required
              rows={4}
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
                resize: "vertical",
                minHeight: "110px",
              }}
            />

            <textarea
              placeholder="Reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              required
              rows={6}
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
                resize: "vertical",
                minHeight: "140px",
              }}
            />

            <textarea
              placeholder="Prayer"
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              required
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
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published
            </label>

            <button type="submit" style={primaryButtonStyle}>
              {editingId ? "Update Devotion" : "Add Devotion"}
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
        {devotions.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>{d.title}</h3>

            <p style={metaStyle}>
              <strong>Date:</strong> {d.publish_date || "—"}
            </p>
            <p style={metaStyle}>
              <strong>Scripture:</strong> {d.scripture_reference || "—"}
            </p>
            <p style={metaStyle}>
              <strong>Status:</strong> {d.is_published ? "Published" : "Draft"}
            </p>

            {d.scripture_text && (
              <p style={{ marginTop: "0.85rem", fontStyle: "italic" }}>
                {d.scripture_text}
              </p>
            )}

            {d.reflection && (
              <p style={{ marginTop: "0.85rem" }}>
                {d.reflection.length > 240
                  ? `${d.reflection.slice(0, 240)}...`
                  : d.reflection}
              </p>
            )}

            {d.prayer && (
              <p style={{ marginTop: "0.85rem", marginBottom: "1rem" }}>
                <strong>Prayer:</strong>{" "}
                {d.prayer.length > 140 ? `${d.prayer.slice(0, 140)}...` : d.prayer}
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
                onClick={() => handleEdit(d)}
                style={secondaryButtonStyle}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => togglePublished(d.id, d.is_published, d.publish_date)}
                style={secondaryButtonStyle}
              >
                {d.is_published ? "Unpublish" : "Publish"}
              </button>

              <button
                type="button"
                onClick={() => deleteDevotion(d.id)}
                style={dangerButtonStyle}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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