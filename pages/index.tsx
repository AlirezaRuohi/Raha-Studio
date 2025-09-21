// pages/index.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import type { GetServerSideProps } from "next";

const persianNameRegex = /^[\u0600-\u06FF\s‌]+$/;
const iranMobileRegex = /^(?:\+?98|0)?9\d{9}$/;

export default function Home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onPhoneChange = (v: string) => {
    let s = v.replace(/[^\d+]/g, "");
    if (s.indexOf("+") > 0) s = s.replace(/\+/g, "");
    setPhone(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!persianNameRegex.test(firstName.trim()))
      return setError("نام باید فارسی باشد");
    if (!persianNameRegex.test(lastName.trim()))
      return setError("نام خانوادگی باید فارسی باشد");
    if (!iranMobileRegex.test(phone.trim()))
      return setError("شماره موبایل معتبر نیست");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("phone", phone);

      const res = await fetch(`https://rahastudio.com/api/save.php`, {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        document.cookie = "rahareg=1; Path=/; Max-Age=7776000; SameSite=Lax; Secure";
        router.push("/landing");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "خطا در ذخیره اطلاعات");
      }
    } catch (err: any) {
      setError(err.message || "خطا در برقراری ارتباط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>رها استودیو | ثبت‌نام</title>
      </Head>

      <main className="wrap" dir="rtl">
        <section className="card">
          <div className="logoWrap">
            <Image src="/logo.png" alt="لوگو" width={72} height={72} priority className="logo" />
          </div>

          <h1 className="title">سلام سلطان</h1>
          <p className="subtitle">برای دریافت، اطلاعاتت رو وارد کن</p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="label" htmlFor="firstName">نام (فارسی)</label>
            <input
              id="firstName"
              className="input"
              placeholder="مثلاً: علی"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              inputMode="text"
              dir="rtl"
            />

            <label className="label" htmlFor="lastName">نام خانوادگی (فارسی)</label>
            <input
              id="lastName"
              className="input"
              placeholder="مثلاً: محمدی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              inputMode="text"
              dir="rtl"
            />

            <label className="label" htmlFor="phone">شماره موبایل</label>
            <input
              id="phone"
              className="input"
              placeholder="09xxxxxxxxx | +989xxxxxxxxx"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              pattern="^(?:\\+?98|0)?9\\d{9}$"
              maxLength={13}
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              required
            />

            {error && <div className="error">{error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "در حال ثبت…" : "ثبت اطلاعات"}
            </button>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ffd93d, #ffb100);
          padding: 24px 12px;
          
        }
        .card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.24);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }
        .logoWrap {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        .logo {
          border-radius: 10px;
        }
        .title {
          margin: 8px 0 4px;
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          color: #212529;
        }
        .subtitle {
          margin: 0 0 20px;
          text-align: center;
          color: #333;
          font-size: 14px;
        }
        .label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin-top: 8px;
        }
        .input {
          width: 100%;
          padding: 12px 12px;
          margin-top: 4px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.85);
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #e0b000;
          box-shadow: 0 0 0 3px rgba(255,185,0,0.18);
        }
        .btn {
          margin-top: 16px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e7b800;
          background: #ffb100;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.06s ease-in-out;
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn[disabled] {
          background: #ffeaa7;
          cursor: not-allowed;
        }
        .error {
          margin-top: 12px;
          background: #ffe6e6;
          border: 1px solid #ffb3b3;
          color: #b10000;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          text-align: center;
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasCookie = (req.headers.cookie || "").includes("rahareg=1");
  if (hasCookie) {
    return { redirect: { destination: "/landing", permanent: false } };
  }
  return { props: {} };
};
