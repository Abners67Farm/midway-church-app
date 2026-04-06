export default function GivePage() {
  return (
    <div className="page">
      <h1>Give</h1>
      <p className="page-intro">
        Thank you for supporting the ministry of Midway Baptist Church.
      </p>

      <div className="card">
        <h2>Online Giving</h2>
        <p>
          Online giving information will be added here soon.
        </p>
        <a
          href="https://..."
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          Give Now
        </a>
      </div>

      <div className="card">
        <h2>In Person</h2>
        <p>Giving is available during each worship service.</p>
      </div>

      <div className="card">
        <h2>By Mail</h2>
        <p>
          Midway Baptist Church
          <br />
          1218 SC-284
          <br />
          Abbeville, SC 29620
        </p>
      </div>
    </div>
  );
}