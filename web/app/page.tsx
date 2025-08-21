"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("Pinox IDE – Hello 👋 (Next.js stub)");
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 360px", height: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 12 }}>FileTree (stub)</aside>
      <main style={{ padding: 12 }}>
        <h1>{msg}</h1>
        <p>EditorTabs (Monaco) and RunPanel will render here.</p>
        <button onClick={() => alert("Run sandbox (stub)")}>▶ Run</button>
      </main>
      <aside style={{ borderLeft: "1px solid #eee", padding: 12 }}>ChatDock (stub)</aside>
    </div>
  );
}
