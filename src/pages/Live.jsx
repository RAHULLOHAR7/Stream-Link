export default function Live() {
  return (
    <div className="live-wrapper">
      <div className="live-header">
        <div className="live-badge">
          <span className="live-dot"></span>
          Live Stream
        </div>
        <h1>Live Session</h1>
        <p>You are securely connected to the live stream</p>
      </div>

      <div className="video-card">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
