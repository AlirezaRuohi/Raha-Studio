import Head from "next/head";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";

export default function Landing() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const files = useMemo(
    () => [
      { path: "/pdfs/trendy-insta-filters.pdf", label: "فیلترها.pdf" },
      { path: "/pdfs/trendy-insta-filters-2025.pdf", label: "فیلترهای-2025.pdf" },
    ],
    []
  );

  const [errList, setErrList] = useState<string[]>([]);

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
    files.forEach((f) => {
      download(`${base}${f.path}`, f.label);
    });
  }, [base, files]);

  return (
    <>
      <Head>
        <title>رها استودیو</title>
      </Head>
      <main className="page" dir="rtl">
        <section
          className="card"
          style={{ position: "relative", textAlign: "center", paddingTop: 72 }}
        >
          <Image
            src="/logo.png"
            alt="لوگوی سایت"
            width={64}
            height={64}
            priority
            style={{ position: "absolute", top: 16, right: 16 }}
          />

          <h2 className="status">ثبت‌نام با موفقیت انجام شد ✅</h2>
          <p className="hel">فایل‌هایت آماده است</p>

          <button className="btn" onClick={downloadAll}>
            📥 دانلود همه فایل‌ها
          </button>

          {errList.length > 0 && (
            <div
              className="error"
              style={{ marginTop: 12, textAlign: "left", direction: "ltr" }}
            >
              Some files were not found:
              <ul>
                {errList.map((u) => (
                  <li key={u}>
                    <code>{u}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

// محافظت: اگر کوکی نداشت → ریدایرکت
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasCookie = (req.headers.cookie || "").includes("rahareg=1");
  if (!hasCookie) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};
