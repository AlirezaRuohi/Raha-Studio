// pages/api/export.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPool } from "mysql2/promise";
import * as XLSX from "xlsx";

type Row = { نام: string; "نام‌خانوادگی": string; موبایل: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    // دیتابیس با env vars (در Vercel یا .env.local ست کن)
    const pool = createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      // اگر پورت متفاوت است میتونی port: Number(process.env.DB_PORT) اضافه کنی
    });

    const [rows] = await pool.query(
      "SELECT firstName, lastName, phone, createdAt FROM registrations ORDER BY createdAt DESC"
    );

    // map به خروجی فارسی-friendly
    const data: Row[] = (rows as any[]).map((r) => ({
      نام: r.firstName ?? "",
      "نام‌خانوادگی": r.lastName ?? "",
      موبایل: r.phone ?? "",
    }));

    // ساخت شیت و ورک‌بوک
    const ws = XLSX.utils.json_to_sheet<Row>(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ثبت‌نام‌ها");

    // تولید بافر باینری
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // هدرها و ارسال
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="registrations.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buf);
  } catch (err: any) {
    console.error("export error:", err);
    return res.status(500).json({ message: err?.message || "export failed" });
  }
}
