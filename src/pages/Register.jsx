import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    nav("/otp");
  };

  return (
    <div className="center">
      <div className="card">
        <div className="card-header">
          <span className="badge">Step 1 of 2</span>
          <h2>Request access</h2>
          <p>Enter your email to receive a one‑time passcode.</p>
        </div>

        <form className="card-body" onSubmit={handleSubmit}>
          <label className="input-label" htmlFor="email">
            Email address
          </label>

          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <p className="input-hint">
            We&apos;ll send your OTP to this email for verification.
          </p>

          <button className="btn btn-full" type="submit" disabled={!email}>
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
