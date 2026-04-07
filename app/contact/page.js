export default function ContactPage() {
  return (
    <div className="page">
      <h1>Contact & Location</h1>
      <p className="page-intro">
        We would love to hear from you and help you get connected.
      </p>

      <div className="card">
        <h2>Address</h2>
        <p>1218 SC-284</p>
        <p>Abbeville, SC 29620</p>
      </div>

      <div className="card">
        <h2>Phone</h2>
        <p>(864) 561-2763</p>
      </div>

      <div className="card">
        <h2>Email / Website</h2>
        <p>discovermidwaychurch.org</p>
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