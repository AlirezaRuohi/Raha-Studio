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
      {
        path: "/pdfs/trendy-insta-filters-2025.pdf",
        label: "فیلترهای-2025.pdf",
      },
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
        setDone((p) => [...p, f.label]);
        await new Promise((r) => setTimeout(r, 220));
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

      <main dir="rtl" className="page">
        <section className="card">
          {/* هدر */}
          <header className="header">
            <div className="brand">
              <Image
                src="/logo.png"
                alt="لوگوی سایت"
                width={54}
                height={54}
                className="logo"
              />
              <div className="titles">
                <h1>دانلود فایل‌ها</h1>
                <p>ثبت‌نام با موفقیت انجام شد ✅</p>
              </div>
            </div>

            <button
              onClick={downloadAll}
              disabled={busy}
              className="btn btnAll"
              aria-label="دانلود همه فایل‌ها"
            >
              📥 دانلود همه
            </button>
          </header>

          {/* لیست فایل‌ها */}
          <div className="grid">
            {files.map((f) => (
              <div key={f.path} className="item">
                <div className="info">
                  <span className="dot" aria-hidden />
                  <div className="meta">
                    <div className="name" title={f.label}>
                      {f.label}
                    </div>
                    <div className="path" title={f.path}>
                      {f.path}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadOne(f)}
                  disabled={busy}
                  className="btn btnSingle"
                  aria-label={`دانلود ${f.label}`}
                >
                  دانلود
                </button>
              </div>
            ))}
          </div>

          {/* وضعیت */}
          <div className="status">
            {busy && <span>در حال آماده‌سازی دانلود…</span>}
            {!busy && done.length > 0 && !err && (
              <span>دانلود {done.length} فایل انجام شد.</span>
            )}
            {err && <div className="error">{err}</div>}
          </div>
        </section>
      </main>

      {/* استایل‌ها */}
      <style jsx>{`
        :root {
          --bg1: #ffd93d;
          --bg2: #ffb100;
          --card-bg: rgba(255, 255, 255, 0.28);
          --card-brd: rgba(255, 255, 255, 0.38);
          --ink: #212529;
          --muted: #555;
          --accent: #ffb100;
          --accent-2: #ffd93d;
          --line: rgba(0, 0, 0, 0.06);
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg1), var(--bg2));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 12px;
          font-family: Tahoma, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 820px;

          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: space-between;
          flex-wrap: wrap;
          row-gap: 10px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .logo {
          border-radius: 10px;
          flex: 0 0 auto;
        }
        .titles {
          min-width: 0;
        }
        .titles h1 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: var(--ink);
          line-height: 1.2;
        }
        .titles p {
          margin: 2px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.2;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          border: 1px solid #e7b800;
          transition: transform 0.06s ease-in-out, box-shadow 0.12s ease;
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
          white-space: nowrap;
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btnAll {
          background: var(--accent);
          color: #222;
        }
        .btn[disabled] {
          background: #ffeaa7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .lead {
          margin: 12px 2px 14px;
          color: var(--muted);
          font-size: 14px;
          text-align: justify;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .item {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.75);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          flex: 0 0 auto;
          box-shadow: 0 0 0 4px rgba(255, 177, 0, 0.18);
        }
        .meta {
          min-width: 0;
          line-height: 1.3;
        }
        .name {
          font-weight: 700;
          color: var(--ink);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 58vw;
        }
        .path {
          font-size: 12px;
          color: #666;
          direction: ltr;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 58vw;
        }

        .btnSingle {
          background: var(--accent-2);
          color: #222;
        }

        .status {
          margin-top: 10px;
          min-height: 22px;
          text-align: center;
          color: #444;
        }
        .error {
          margin-top: 8px;
          background: #ffe6e6;
          border: 1px solid #ffb3b3;
          color: #b10000;
          padding: 8px 10px;
          border-radius: 10px;
          direction: ltr;
          text-align: left;
          display: inline-block;
          max-width: 100%;
        }

        /* اسکرین‌های متوسط و بزرگ‌تر */
        @media (min-width: 480px) {
          .titles h1 {
            font-size: 20px;
          }
          .titles p {
            font-size: 13.5px;
          }
        }
        @media (min-width: 700px) {
          .card {
            padding: 20px;
          }
          .grid {
            grid-template-columns: 1fr 1fr;
          }
          .name,
          .path {
            max-width: 40vw;
          }
        }
        @media (min-width: 920px) {
          .titles h1 {
            font-size: 22px;
          }
          .lead {
            font-size: 15px;
          }
        }
      `}</style>
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
