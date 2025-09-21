// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
      <Head>
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="دریافت فایل" />
        <title>رها استودیو</title>
      </Head>
      <body style={{ margin: 0, fontFamily: "Tahoma, sans-serif", background: "linear-gradient(135deg, #FFD93D, #FFB100)" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
