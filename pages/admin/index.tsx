// pages/admin/index.tsx
import Head from "next/head";
import type { GetServerSideProps } from "next";

type Item = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
};

export default function Admin({ items, error }: { items: Item[]; error?: string }) {
  return (
    <>
      <Head><title>ادمین | لیست ثبت‌نام‌ها</title></Head>

      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 12px" }}>
        <h1 style={{ marginBottom: 12 }}>لیست ثبت‌نام‌ها</h1>

        <div style={{ marginBottom: 12 }}>
          <a
            href={`https://rahastudio.com/api/export.php`}
            className="btn btn--ghost"
            style={{ display: "inline-block" }}
          >
            📥 خروجی CSV
          </a>
        </div>

        {error ? (
          <div style={{ padding: 24, color: "rgb(200,50,50)" }}>
            خطا در دریافت اطلاعات: {error}
          </div>
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead style={{ background: "#fff8c6" }}>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>نام</th>
                  <th style={thStyle}>نام‌خانوادگی</th>
                  <th style={thStyle}>موبایل</th>
                  <th style={thStyle}>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 16, textAlign: "center" }}>رکوردی نیست</td></tr>
                ) : (
                  items.map((r, i) => (
                    <tr key={r.id} style={i % 2 ? rowAlt : {}}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{r.firstName}</td>
                      <td style={tdStyle}>{r.lastName}</td>
                      <td style={{ ...tdStyle, direction: "ltr" }}>{r.phone}</td>
                      <td style={{ ...tdStyle, direction: "ltr" }}>{formatFaDate(r.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch("https://rahastudio.com/api/list.php", { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return { props: { items: [], error: `HTTP ${res.status}: ${text.slice(0,200)}` } };
    }
    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data.items) ? data.items : [];
    return { props: { items } };
  } catch (e: any) {
    return { props: { items: [], error: e?.message || "Network error" } };
  }
};

// استایل‌های ساده
const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "12px 16px", borderBottom: "1px solid #eee", fontWeight: 600, fontSize: 14,
};
const tdStyle: React.CSSProperties = {
  padding: "10px 16px", borderBottom: "1px solid #f1e6b3", fontSize: 14,
};
const rowAlt: React.CSSProperties = { background: "#fffdf3" };

function formatFaDate(mysqlTs?: string) {
  if (!mysqlTs) return "";
  try {
    const d = new Date(mysqlTs.replace(" ", "T"));
    return d.toLocaleString("fa-IR");
  } catch { return mysqlTs; }
}
