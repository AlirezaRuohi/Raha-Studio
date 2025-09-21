// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../lib/mongodb";
import Registration from "../../models/Registration";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { firstName, lastName, phone } = req.body || {};
    console.log("API /register BODY:", { firstName, lastName, phone });

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: "اطلاعات ناقص" });
    }

    await connect();
    const doc = await Registration.create({ firstName, lastName, phone });
    console.log("INSERTED:", doc._id);

    return res.status(201).json({ ok: true });
  } catch (err: any) {
    console.error("Register API error:", err);
    return res.status(500).json({ message: err.message });
  }
}
