// pages/api/export.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../../lib/mysql";
import * as XLSX from "xlsx";
import type { RowDataPacket } from "mysql2";

type Row = { نام: string; "نام‌خانوادگی": string; موبایل: string };

interface RegRow extends RowDataPacket {
  firstName: string;
  lastName: string;
  phone: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const key = req.query.key as string | undefined;
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ message: "forbidden" });

  try {
    const pool = getPool();
    const [rows] = await pool.query<RegRow[]>(
      "SELECT firstName, lastName, phone FROM registrations ORDER BY createdAt DESC"
    );

    const data: Row[] = rows.map((r) => ({
      "نام": r.firstName,
      "نام‌خانوادگی": r.lastName,
      "موبایل": r.phone,
    }));

    const ws = XLSX.utils.json_to_sheet<Row>(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ثبت‌نام‌ها");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader('Content-Disposition', 'attachment; filename="registrations.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buf);
  } catch (e: any) {
    console.error("export error:", e);
    return res.status(500).json({ message: e.message || "export failed" });
  }
}
