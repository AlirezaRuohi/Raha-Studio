import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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

  if (!persianNameRegex.test(firstName.trim())) return setError("نام باید فارسی باشد");
  if (!persianNameRegex.test(lastName.trim()))  return setError("نام خانوادگی باید فارسی باشد");
  if (!iranMobileRegex.test(phone.trim()))      return setError("شماره موبایل معتبر نیست");

  setLoading(true);
  try {
    const form = new FormData();
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("phone", phone);

    const res = await fetch(`https://rahastudio.com/api/save.php`, {
      method: "POST",
      body: form,
      // اگر دامنه‌ها متفاوت‌اند و CORS خطا داد:
      // mode: "cors",
      // credentials: "omit",
    });

    if (res.ok) {
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
    <main className="page" dir="rtl">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Image
          src="/logo.svg"
          alt="لوگو سایت"
          width={70}
          height={70}
          priority
          style={{position:"absolute",top:"20px",right:"20px"}}
        />
        <h1 className="title">سلام سلطان خوبی</h1>
        <p className="helper">اطلاعاتتو وارد کن تا بهت بگم 💛</p>

        <div className="field">
          <label className="label" htmlFor="firstName">
            نام (فارسی)
          </label>
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
        </div>

        <div className="field">
          <label className="label" htmlFor="lastName">
            نام خانوادگی (فارسی)
          </label>
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
        </div>

        <div className="field">
          <label className="label" htmlFor="phone">
            شماره موبایل
          </label>
          <input
            id="phone"
            className="input"
            placeholder="09xxxxxxxxx | +989xxxxxxxxx"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            pattern="^(?:\+?98|0)?9\d{9}$"
            title="مثال: 09123456789 یا +989123456789"
            maxLength={13}
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت اطلاعات"}
        </button>
      </form>
    </main>
  );
}
