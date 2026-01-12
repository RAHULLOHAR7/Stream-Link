import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      nav("/live");
    }
  };

  return (
    <div className="center">
      <div className="card otp-card">
        <div className="card-header">
          <span className="badge">Step 2 of 2</span>
          <h2>Verify your OTP</h2>
          <p>We&apos;ve sent a 6‑digit code to the email you entered.</p>
        </div>

        <form className="card-body" onSubmit={handleSubmit}>
          <label className="input-label" htmlFor="otp">
            One‑time password
          </label>

          <div className="input-wrapper">
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <p className="input-hint">
            For this demo, use <span className="code-chip">123456</span> to join
            the live session.
          </p>

          <button
            className="btn btn-full"
            type="submit"
            disabled={otp.length !== 6}
          >
            Enter live session
          </button>
        </form>

        <div className="card-footer otp-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => nav("/register")}
          >
            Wrong email? Request a new code
          </button>
        </div>
      </div>
    </div>
  );
}
