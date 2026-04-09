import { supabase } from "@/lib/supabase";

function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DevotionsPage() {
  const today = new Date().toISOString().split("T")[0];

  const { data: devotions } = await supabase
    .from("devotions")
    .select("*")
    .eq("is_published", true)
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  const featuredDevotion = devotions && devotions.length > 0 ? devotions[0] : null;
  const recentDevotions =
    devotions && devotions.length > 1 ? devotions.slice(1) : [];

  return (
    <main className="page">
      <div className="container">
        <h1>Daily Devotion</h1>

        {!featuredDevotion && (
          <p style={{ marginTop: "1rem" }}>
            No devotion available right now. Please check back soon.
          </p>
        )}

        {featuredDevotion && (
          <div className="devotion-card">
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#1e73be",
                marginBottom: "0.5rem",
              }}
            >
              TODAY'S DEVOTION
            </p>

            <p
              style={{
                color: "#666",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              {formatDate(featuredDevotion.publish_date)}
            </p>

            <h2>{featuredDevotion.title}</h2>

            <p className="devotion-scripture-ref">
              {featuredDevotion.scripture_reference}
            </p>

            <p className="devotion-scripture-text">
              {featuredDevotion.scripture_text}
            </p>

            <h3>Reflection</h3>
            <p>{featuredDevotion.reflection}</p>

            <h3>Prayer</h3>
            <p>{featuredDevotion.prayer}</p>
          </div>
        )}

        {recentDevotions.length > 0 && (
          <section style={{ marginTop: "2rem", maxWidth: "720px" }}>
            <h2 style={{ marginBottom: "1rem" }}>Recent Devotions</h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              {recentDevotions.map((devotion) => (
                <div className="devotion-card" key={devotion.id}>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(devotion.publish_date)}
                  </p>

                  <h3 style={{ marginTop: 0 }}>{devotion.title}</h3>

                  <p className="devotion-scripture-ref">
                    {devotion.scripture_reference}
                  </p>

                  <p>
                    {devotion.reflection.length > 220
                      ? `${devotion.reflection.slice(0, 220)}...`
                      : devotion.reflection}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}