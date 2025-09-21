// pages/api/export.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPool, Pool } from "mysql2/promise";
import * as XLSX from "xlsx";

// مطمئن شو این روت روی Node اجرا میشه (نه Edge)
export const config = {
  api: {
    bodyParser: false,       // احتیاط: بی‌نیازیم ولی از تضاد جلوگیری میکند
    responseLimit: false,    // فایل‌های نسبتاً بزرگ هم اوکی
  },
};

type Row = { نام: string; "نام‌خانوادگی": string; موبایل: string };

// --- یک بار Pool بسازیم و کش کنیم ---
let _pool: Pool | null = (global as any)._mysqlPool || null;
function getPool() {
  if (!_pool) {
    _pool = createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      // port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    });
    (global as any)._mysqlPool = _pool;
  }
  return _pool;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT firstName, lastName, phone FROM registrations ORDER BY createdAt DESC"
    );

    const data: Row[] = (rows as any[]).map((r) => ({
      نام: r.firstName ?? "",
      "نام‌خانوادگی": r.lastName ?? "",
      موبایل: r.phone ?? "",
    }));

    // ساخت شیت و ورک‌بوک
    const ws = XLSX.utils.json_to_sheet<Row>(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ثبت‌نام‌ها");

    // روش مطمئن: خروجی Uint8Array و تبدیل به Buffer
    const u8: Uint8Array = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array", // ← خروجی آرایه‌ی باینری
    });
    const buf = Buffer.from(u8);

    // هدرها (خیلی مهم)
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="registrations.xlsx"');
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Content-Length", String(buf.length));

    // ارسال
    res.status(200).end(buf);
  } catch (err: any) {
    console.error("export error:", err);
    return res.status(500).json({ message: err?.message || "export failed" });
  }
}
