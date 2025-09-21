// pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "نام کاربری یا رمز اشتباه است");
      }
    } catch (err: any) {
      setError(err?.message || "خطا در ارتباط با سرور");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>ورود ادمین</title>
      </Head>

      <main className="wrap" dir="rtl">
        <section className="card">
          <div className="brand">
            <div className="logo">
              <Image src="/logo.png" alt="لوگو" width={64} height={64} priority />
            </div>
            <div className="titles">
              <h1>ورود ادمین</h1>
              <p>برای ادامه، وارد شوید</p>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <label className="label" htmlFor="user">نام کاربری</label>
            <input
              id="user"
              className="input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={busy}
            />

            <label className="label" htmlFor="pass">رمز عبور</label>
              <input
                id="pass"
                className="input pass"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={busy}
              />
             

            {error && <div className="error">{error}</div>}

            <button className="btn" type="submit" disabled={busy}>
              {busy ? "در حال ورود…" : "ورود"}
            </button>
          </form>
        </section>
      </main>

      <style jsx>{`
        :root {
          --bg1:#FFD93D; --bg2:#FFB100;
          --glass: rgba(255,255,255,0.28);
          --glass-brd: rgba(255,255,255,0.38);
          --ink:#212529; --muted:#555;
          --line: rgba(0,0,0,0.06);
          --accent:#FFB100; --accent2:#FFD93D;
        }

        .wrap {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--bg1), var(--bg2));
          padding: 24px 12px;
          
        }
        .card {
          width: 100%; max-width: 480px;
          background: var(--glass);
          border: 1px solid var(--glass-brd);
          border-radius: 16px;
          padding: 18px;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.12);
        }
        .brand {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .logo :global(img) { border-radius: 10px; }
        .titles h1 { margin: 0; font-size: 20px; font-weight: 800; color: var(--ink); }
        .titles p { margin: 2px 0 0; color: var(--muted); font-size: 13px; }

        form { display: grid; gap: 10px; }
        .label { font-size: 13px; color: #333; font-weight: 700; margin-top: 6px; }
        .input {
          width: 100%;
          padding: 12px 12px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255,255,255,0.85);
          outline: none; font-size: 14px;
        }
        .input:focus { border-color: #e0b000; box-shadow: 0 0 0 3px rgba(255,185,0,0.18); }

        .passBox { position: relative; }
        .pass { padding-right: 10px; }
        .toggle {
          position: absolute; top: 50%; transform: translateY(-50%);
          right: 8px; border: 1px solid #f2d27a; background: #fff4bf;
          border-radius: 10px; padding: 6px 10px; cursor: pointer; font-size: 14px;
        }

        .btn {
          margin-top: 6px;
          padding: 12px 16px; width: 100%;
          border-radius: 12px; border: 1px solid #e7b800;
          background: var(--accent);
          font-weight: 800; cursor: pointer;
          transition: transform .06s ease-in-out, box-shadow .12s ease;
          box-shadow: 0 2px 0 rgba(0,0,0,0.06);
        }
        .btn:active { transform: translateY(1px); }
        .btn[disabled] { background: #ffeaa7; cursor: not-allowed; box-shadow: none; }

        .error {
          background: #ffe6e6; border: 1px solid #ffb3b3;
          color: #b10000; padding: 10px 12px; border-radius: 12px;
          font-size: 13px;
        }

        .hint {
          margin: 10px 2px 0; font-size: 12px; color: #444; text-align: center;
        }
        .hint code { direction: ltr; background: rgba(255,255,255,0.6); padding: 1px 6px; border-radius: 6px; }
      `}</style>
    </>
  );
}
