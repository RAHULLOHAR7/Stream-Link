import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="center home-hero">
      <div className="home-panel">
        <span className="home-eyebrow">Client preview · OTP‑gated live access</span>

        <h1 className="home-title">
          Private &amp; secure
          <br />
          live streaming, in minutes.
        </h1>

        <p className="home-subtitle">
          Share a single link, verify viewers by email + one‑time passcode, and guide
          them into a premium live experience that feels built just for them.
        </p>

        <div className="home-cta-row">
          <button className="btn" onClick={() => nav("/register")}>
            Request access demo
          </button>
        </div>

        <div className="home-meta-row">
          <span className="home-highlight">No passwords, no friction.</span>
          <span className="home-caption">Viewer entries are fully OTP verified.</span>
        </div>
      </div>
    </div>
  );
}
