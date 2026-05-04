import { useRef, useEffect } from "react";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Cursor } from "./components/Cursor";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      videoRef.current.play().catch(e => console.error("Video auto-play failed", e));
    }
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <Cursor />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 0,
            pointerEvents: "none",
            filter: "brightness(0.9) contrast(1.0)"
          }}
        >
          <source src="/background_video.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 12% -10%, rgba(30, 41, 59, 0.65), transparent 34rem), " +
              "radial-gradient(circle at 85% 18%, rgba(255, 212, 0, 0.045), transparent 26rem), " +
              "rgba(5, 8, 15, 0.85)"
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <Layout />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
