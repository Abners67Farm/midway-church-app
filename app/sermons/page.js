"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);

  useEffect(() => {
    fetchSermons();
  }, []);

  async function fetchSermons() {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .eq("is_active", true)
      .order("sermon_date", { ascending: false });

    if (error) console.error(error);
    else setSermons(data);
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

  return (
    <div className="page">
      <h1>Sermons</h1>

      <div className="sermon-grid">
        {sermons.map((sermon) => {
          const thumbnail =
            sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);

          return (
            <div key={sermon.id} className="sermon-card">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={sermon.title}
                  className="sermon-image"
                />
              )}

              <div className="sermon-content">
                <h3>{sermon.title}</h3>
                <p className="sermon-meta">
                  {sermon.preacher} •{" "}
                  {new Date(sermon.sermon_date).toLocaleDateString()}
                </p>

                {sermon.scripture && (
                  <p className="sermon-scripture">{sermon.scripture}</p>
                )}

                <p>{sermon.description}</p>

                <a
                  href={sermon.youtube_url}
                  target="_blank"
                  className="sermon-button"
                >
                  Watch Sermon
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}