// pages/api/admin-login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body || {};

  const ADMIN_USER = process.env.ADMIN_USER ;
  const ADMIN_PASS = process.env.ADMIN_PASS ;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // ست‌کردن کوکی سشن
    res.setHeader("Set-Cookie", serialize("admin_auth", "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 // ۱ ساعت
    }));
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ message: "رمز یا نام کاربری اشتباه است" });
}
