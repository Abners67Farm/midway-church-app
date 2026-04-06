export default function LivestreamPage() {
  return (
    <div className="page">
      <h1>Livestream</h1>
      <p className="page-intro">
        Join us online for worship and preaching.
      </p>

      <div className="card">
        <h2>Watch Live</h2>
        <p>You can watch our livestream here:</p>
        <a
          href="https://www.facebook.com/MidwayBaptistChurchAbbevilleSC"
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Watch on Facebook
        </a>
      </div>

      <div className="card">
        <h2>Service Times</h2>
        <p>Sunday School - 10:00 AM</p>
        <p>Morning Worship - 11:00 AM</p>
        <p>Wednesday Bible Study - 6:30 PM</p>
      </div>
    </div>
  );
}