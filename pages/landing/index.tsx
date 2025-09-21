// pages/landing/index.tsx
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

export default function Landing() {
  // اگر در next.config.ts basePath تعریف کرده‌ای، این را ست کن
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const files = useMemo(
    () => [
      { path: "/pdfs/independence-day-chatgpt-prompts-tecrazy.pdf", label: "راهنما.pdf" },
      { path: "/pdfs/trendy-insta-filters.pdf",                     label: "فیلترها.pdf" },
      { path: "/pdfs/trendy-insta-filters-2025.pdf",                label: "فیلترهای-2025.pdf" },
    ],
    []
  );

  const [errList, setErrList] = useState<string[]>([]);

  const checkExists = async (url: string) => {
    try {
      const r = await fetch(url, { method: "HEAD" });
      return r.ok;
    } catch {
      return false;
    }
  };

  const download = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = useCallback(async () => {
    setErrList([]);
    // URLs نهایی (با basePath)
    const items = files.map(f => ({
      url: `${base}${f.path}`,
      filename: f.label,
    }));

    // پیش‌بررسی وجود فایل‌ها
    const results = await Promise.all(items.map(it => checkExists(it.url)));

    const missing: string[] = [];
    items.forEach((it, i) => {
      if (!results[i]) missing.push(it.url);
    });

    if (missing.length) {
      setErrList(missing);
      // همچنان فایل‌های موجود را دانلود کن
      items.forEach((it, i) => {
        if (results[i]) download(it.url, it.filename);
      });
      return;
    }

    // همه موجودند → همزمان دانلود کن
    items.forEach(it => download(it.url, it.filename));
  }, [base, files]);

  return (
    <main className="page" dir="rtl">
      <section className="card" style={{ position: "relative", textAlign: "center", paddingTop: 72 }}>
        <Image
          src="/logo.svg"
          alt="لوگوی سایت"
          width={64}
          height={64}
          priority
          style={{ position: "absolute", top: 16, right: 16 }}
        />

        <h1 className="title">رها استودیو</h1>
        <h2 className="status">ثبت‌نام با موفقیت انجام شد ✅</h2>
        <p className="helper">برای دریافت همه فایل‌ها، روی دکمه زیر کلیک کنید.</p>

        <button className="btn" onClick={downloadAll}>📥 دانلود همزمان ۳ فایل PDF</button>

        {errList.length > 0 && (
          <div className="error" style={{ marginTop: 12, textAlign: "left", direction: "ltr" }}>
            Some files were not found:
            <ul>
              {errList.map(u => <li key={u}><code>{u}</code></li>)}
            </ul>
            مسیرها را با نام واقعی فایل‌ها در فولدر <strong>public/pdfs</strong> تطبیق بده.
          </div>
        )}
      </section>
    </main>
  );
}
