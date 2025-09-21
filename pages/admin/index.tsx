import type { GetServerSideProps } from "next";
import { getPool } from "../../lib/mysql";

type Item = { id:number; firstName:string; lastName:string; phone:string; createdAt:string; };

export default function Admin({ items }: { items: Item[] }) {
  return (
    <div style={{maxWidth:800, margin:"40px auto"}}>
      <h1>لیست ثبت‌نام‌ها</h1>
      <table border={1} style={{width:"100%", marginTop:16}}>
        <thead>
          <tr><th>نام</th><th>نام‌خانوادگی</th><th>موبایل</th><th>تاریخ</th></tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r.id}>
              <td>{r.firstName}</td>
              <td>{r.lastName}</td>
              <td dir="ltr">{r.phone}</td>
              <td dir="ltr">{r.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const key = ctx.query.key;
  if (key !== process.env.ADMIN_KEY) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM registrations ORDER BY createdAt DESC");

  return {
    props: {
      items: JSON.parse(JSON.stringify(rows)),
    },
  };
};
