import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../lib/mysql";
import Registration from "../../models/Registration";
import * as XLSX from "xlsx";

type Row = { نام: string; "نام‌خانوادگی": string; موبایل: string; };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const key = req.query.key as string | undefined;
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ message: "forbidden" });

  await connect();
  const regs = await Registration.find().lean();
  const data: Row[] = (regs as any[]).map(r => ({ نام:r.firstName, "نام‌خانوادگی":r.lastName, موبایل:r.phone }));
  const ws = XLSX.utils.json_to_sheet<Row>(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ثبت‌نام‌ها");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=registrations.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
}
