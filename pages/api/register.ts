import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../../lib/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { firstName, lastName, phone } = req.body || {};
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    const pool = getPool();
    await pool.query(
      "INSERT INTO registrations (firstName, lastName, phone) VALUES (?, ?, ?)",
      [firstName, lastName, phone]
    );

    return res.status(201).json({ ok: true });
  } catch (err: any) {
    // 🔴 دیباگ: خطای واقعی را برگردان (فقط موقت)
    console.error("Register MySQL error:", {
      code: err?.code, errno: err?.errno, sqlState: err?.sqlState, sqlMessage: err?.sqlMessage, message: err?.message,
    });
    return res.status(500).json({
      message: "DB_ERROR",
      code: err?.code,
      errno: err?.errno,
      info: err?.sqlMessage || err?.message,
    });
  }
}
