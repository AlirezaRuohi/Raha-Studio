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
      <Head>
        <title>ادمین | لیست ثبت‌نام‌ها</title>
      </Head>

      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 12px", fontFamily: "Tahoma, sans-serif" }}>
        <h1 style={{ marginBottom: 16, textAlign: "center" }}>📋 لیست ثبت‌نام‌ها</h1>

        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <a
            href="https://rahastudio.com/api/export.php"
            className="btn btn--ghost"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "#fff8c6",
              textDecoration: "none",
              color: "#333",
              fontWeight: 500,
            }}
          >
            📥 خروجی CSV
          </a>
        </div>

        {error ? (
          <div style={{ padding: 24, color: "rgb(200,50,50)", textAlign: "center" }}>
            خطا در دریافت اطلاعات: {error}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                direction: "rtl",
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ background: "#FFD93D" }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>نام</th>
                  <th style={thStyle}>نام‌خانوادگی</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>موبایل</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 16, textAlign: "center" }}>
                      رکوردی یافت نشد
                    </td>
                  </tr>
                ) : (
                  items.map((r, i) => (
                    <tr key={r.id} style={i % 2 ? rowAlt : {}}>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                      <td style={tdStyle}>{r.firstName}</td>
                      <td style={tdStyle}>{r.lastName}</td>
                      <td style={{ ...tdStyle, textAlign: "center", direction: "ltr" }}>{r.phone}</td>
                      <td style={{ ...tdStyle, textAlign: "center", direction: "ltr" }}>
                        {formatFaDate(r.createdAt)}
                      </td>
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
      return { props: { items: [], error: `HTTP ${res.status}: ${text.slice(0, 200)}` } };
    }
    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data.items) ? data.items : [];
    return { props: { items } };
  } catch (e: any) {
    return { props: { items: [], error: e?.message || "Network error" } };
  }
};

// استایل‌های جدول
const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "2px solid #e0c200",
  fontWeight: 700,
  fontSize: 14,
  textAlign: "right",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid #eee",
  fontSize: 14,
  textAlign: "right",
};

const rowAlt: React.CSSProperties = {
  background: "#fffdf3",
};

function formatFaDate(mysqlTs?: string) {
  if (!mysqlTs) return "";
  try {
    const d = new Date(mysqlTs.replace(" ", "T"));
    return d.toLocaleString("fa-IR");
  } catch {
    return mysqlTs;
  }
}
