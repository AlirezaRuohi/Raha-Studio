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

      <main dir="rtl" className="page">
        <section className="card">
          {/* Header */}
          <div className="header">
            <div className="logoWrap">
              <Image
                src="/logo.png"
                alt="لوگوی سایت"
                width={64}
                height={64}
                priority
                className="logo"
              />
            </div>
            <div className="titles">
              <h1 className="title">درخواست ثبت شد ✅</h1>
              <p className="subtitle">سلطان، فایل‌ها آمادهٔ دانلودن 👇</p>
            </div>
          </div>

          {/* لیست فایل‌ها */}
          <div className="list">
            {files.map((f) => (
              <div key={f.path} className="item">
                <div className="itemInfo">
                  <span className="badge">PDF</span>
                  <div className="meta">
                    <div className="name">{f.label}</div>
                    <div className="path">{f.path}</div>
                  </div>
                </div>
                <button
                  onClick={() => downloadOne(f)}
                  disabled={busy}
                  className="btn btnSingle"
                >
                  دانلود
                </button>
              </div>
            ))}
          </div>

          {/* دانلود همه */}
          <div className="actions">
            <button onClick={downloadAll} disabled={busy} className="btn btnAll">
              📥 دانلود همه
            </button>
          </div>

          {/* وضعیت/خطا */}
          <div className="status">
            {busy && <span>در حال آماده‌سازی دانلود…</span>}
            {!busy && done.length > 0 && !err && <span>دانلود {done.length} فایل انجام شد.</span>}
            {err && <div className="error">{err}</div>}
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #ffd93d, #ffb100);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 12px;
          font-family: Tahoma, sans-serif;
        }
        .card {
          position: relative;
          width: 100%;
          max-width: 720px;
          background: rgba(255, 255, 255, 0.24);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        /* HEADER موبایل: عمودی و وسط‌چین */
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .logoWrap {
          display: flex;
          justify-content: center;
        }
        .logo {
          border-radius: 8px;
        }
        .titles {
          text-align: center;
        }
        .title {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 800;
          color: #212529;
        }
        .subtitle {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          padding: 12px 14px;
          gap: 12px;
        }
        .itemInfo {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .badge {
          display: inline-flex;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #ffe381;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex: 0 0 auto;
        }
        .meta {
          line-height: 1.3;
          min-width: 0;
        }
        .name {
          font-weight: 700;
          color: #212529;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }
        .path {
          font-size: 12px;
          color: #666;
          direction: ltr;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }

        .btn {
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.06s ease-in-out;
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btnSingle {
          border: 1px solid #e7b800;
          background: #ffd93d;
        }
        .btnSingle[disabled] {
          background: #ffeaa7;
          cursor: not-allowed;
        }
        .actions {
          margin-top: 16px;
          text-align: center;
        }
        .btnAll {
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid #e7b800;
          background: #ffb100;
          font-weight: 800;
        }
        .btnAll[disabled] {
          background: #ffeaa7;
          cursor: not-allowed;
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

        /* ≥480px: لوگو absolute گوشه راست بالا + padding-top کارت برای جلوگیری از هم‌پوشانی */
        @media (min-width: 480px) {
          .card {
            padding: 28px 24px 24px;
            padding-top: 88px; /* فضا برای لوگو */
          }
          .header {
            align-items: center;
            margin-bottom: 12px;
          }
          .logoWrap {
            justify-content: flex-end;
          }
          .logo {
            position: absolute;
            top: 16px;
            right: 16px;
          }
          .title {
            font-size: 22px;
          }
          .name, .path {
            max-width: 60%;
          }
        }

        /* ≥700px: دو ستونه شدن لیست فایل‌ها */
        @media (min-width: 700px) {
          .list {
            grid-template-columns: 1fr 1fr;
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
