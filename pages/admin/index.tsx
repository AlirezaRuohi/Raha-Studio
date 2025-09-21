// pages/admin/index.tsx
import Head from "next/head";

export default function Admin() {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY!;

  return (
    <>
      <Head>
        <title>ادمین | خروجی ثبت‌نام‌ها</title>
      </Head>

      <div style={{maxWidth: 800, margin: "40px auto"}}>
        <h1>لیست ثبت‌نام‌ها</h1>

        {/* دکمه/لینک خروجی CSV از PHP روی هاست */}
        <a
          href={`${base}/api/export.php?key=${encodeURIComponent(adminKey)}`}
          className="btn btn--ghost"
          style={{ display: "inline-block", marginTop: 12 }}
        >
          📥 خروجی CSV
        </a>
      </div>
    </>
  );
}
