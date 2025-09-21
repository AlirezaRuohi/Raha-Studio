import type { GetServerSideProps } from "next";
import connect from "../../lib/mongodb";
import Registration from "../../models/Registration";

type Item = { firstName:string; lastName:string; phone:string; createdAt:string; };

export default function Admin({ items }: { items: Item[] }) {
  return (
    <div style={{maxWidth:800, margin:"40px auto",textAlign:"end"}}>
      <h1 style={{}}>لیست ثبت‌نام‌ها</h1>
      <a href={`/api/export?key=${process.env.NEXT_PUBLIC_ADMIN_KEY ?? "12345"}`}>خروجی اکسل</a>
      <table style={{width:"100%", marginTop:16 , textAlign:"center" , direction:"rtl"}} border={1}>
        <thead><tr><th>نام</th><th>نام‌خانوادگی</th><th>موبایل</th><th>تاریخ</th></tr></thead>
        <tbody>
          {items.map((r, i)=>(
            <tr key={i}><td>{r.firstName}</td><td>{r.lastName}</td><td dir="ltr">{r.phone}</td><td dir="ltr">{r.createdAt}</td></tr>
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
  await connect();
  const regs = await Registration.find().sort({ createdAt:-1 }).lean();
  const items = regs.map((r:any)=>({ ...r, createdAt: new Date(r.createdAt).toLocaleString("fa-IR") }));
  return { props: { items: JSON.parse(JSON.stringify(items)) } };
};
