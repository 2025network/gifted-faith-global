"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Global runtime error:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", background: "#f4f8ff", padding: "64px 20px" }}>
          <section
            style={{
              maxWidth: "640px",
              margin: "0 auto",
              background: "white",
              padding: "32px",
              textAlign: "center",
              border: "1px solid #dbeafe",
              borderRadius: "4px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <p style={{ color: "#d9a441", fontWeight: 700, textTransform: "uppercase" }}>
              Service temporarily unavailable
            </p>
            <h1 style={{ color: "#073b7a" }}>Gifted-Faith Global Ventures is temporarily unavailable.</h1>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>
              Please refresh the page in a moment or contact us directly for assistance.
            </p>
            <a
              href="/contact"
              style={{
                display: "inline-block",
                marginTop: "20px",
                background: "#0b4ea2",
                color: "white",
                padding: "12px 20px",
                textDecoration: "none",
                fontWeight: 700,
                borderRadius: "4px",
              }}
            >
              Contact support
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}
