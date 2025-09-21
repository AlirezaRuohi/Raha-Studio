// pages/landing.tsx
import Head from "next/head";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";

type FileItem = { path: string; label: string };

export default function Landing() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const files = useMemo<FileItem[]>(
    () => [
      { path: "/pdfs/trendy-insta-filters.pdf", label: "فیلترها.pdf" },
      { path: "/pdfs/trendy-insta-filters-2025.pdf", label: "فیلترهای-2025.pdf" },
    ],
    []
  );

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  const safeFilename = (label: string) =>
    /^[\w.\-\s]+$/.test(label) ? label : "download.pdf";

  const downloadOne = async (item: FileItem) => {
    const url = `${base}${item.path}`;
    const res = await fetch(encodeURI(url));
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${item.path}`);
    const blob = await res.blob();
    const obj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = obj;
    a.download = safeFilename(item.label);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(obj), 1500);
  };

  const downloadAll = useCallback(async () => {
    setErr(null);
    setDone([]);
    setBusy(true);
    try {
      for (const f of files) {
        await downloadOne(f);
        setDone((prev) => [...prev, f.label]);
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch (e: any) {
      setErr(e?.message || "Download failed");
    } finally {
      setBusy(false);
    }
  }, [files, base]);

  return (
    <>
      <Head>
        <title>رها استودیو | دانلود فایل‌ها</title>
      </Head>

      <main
        dir="rtl"
        style={{
          minHeight: "100vh",
          margin: 0,
          background: "linear-gradient(135deg, #FFD93D, #FFB100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 12px",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        <section
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 720,
            background: "rgba(255,255,255,0.24)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 20,
            padding: 24,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <Image
            src="/logo.png"
            alt="لوگوی سایت"
            width={64}
            height={64}
            priority
            style={{ position: "absolute", top: 16, right: 16, borderRadius: 8 }}
          />

          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: 22,
              fontWeight: 800,
              color: "#212529",
              textAlign: "center",
            }}
          >
            ثبت‌نام با موفقیت انجام شد ✅
          </h1>
          <p style={{ margin: "0 0 18px", textAlign: "center", color: "#333" }}>
            فایل‌های آماده‌ی دانلود 👇
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
            }}
          >
            {files.map((f) => (
              <div
                key={f.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div style={{ fontWeight: 700, color: "#212529" }}>{f.label}</div>
                <button
                  onClick={() => downloadOne(f)}
                  disabled={busy}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e7b800",
                    background: busy ? "#ffeaa7" : "#FFD93D",
                    cursor: busy ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  دانلود
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              onClick={downloadAll}
              disabled={busy}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid #e7b800",
                background: busy ? "#ffeaa7" : "#FFB100",
                fontWeight: 800,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              📥 دانلود همه
            </button>
          </div>

          <div style={{ marginTop: 12, minHeight: 22, textAlign: "center", color: "#444" }}>
            {busy && <span>در حال آماده‌سازی دانلود…</span>}
            {!busy && done.length > 0 && !err && (
              <span>دانلود {done.length} فایل انجام شد.</span>
            )}
            {err && (
              <div
                style={{
                  marginTop: 8,
                  background: "#ffe6e6",
                  border: "1px solid #ffb3b3",
                  color: "#b10000",
                  padding: "8px 10px",
                  borderRadius: 10,
                  direction: "ltr",
                  textAlign: "left",
                }}
              >
                {err}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasCookie = (req.headers.cookie || "").includes("rahareg=1");
  if (!hasCookie) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};
