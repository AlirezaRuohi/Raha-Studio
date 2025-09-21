// pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin"); // بعد از لاگین موفق برو به صفحه لیست
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "رمز یا نام کاربری اشتباه است");
    }
  };

  return (
    <>
      <Head><title>ورود ادمین</title></Head>
      <main style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",fontFamily:"Tahoma"}}>
        <form onSubmit={handleSubmit} style={{background:"#fff",padding:24,borderRadius:8,boxShadow:"0 4px 10px rgba(0,0,0,0.1)"}}>
          <h2 style={{marginBottom:16}}>ورود ادمین</h2>
          <input
            placeholder="نام کاربری"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={{display:"block",marginBottom:12,padding:8,width:200}}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{display:"block",marginBottom:12,padding:8,width:200}}
          />
          {error && <p style={{color:"red"}}>{error}</p>}
          <button type="submit" style={{padding:"8px 16px",background:"#FFD93D",border:"none",borderRadius:4}}>ورود</button>
        </form>
      </main>
    </>
  );
}
