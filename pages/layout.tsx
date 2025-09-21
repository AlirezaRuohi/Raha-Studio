export const metadata = {
  title: "رها استودیو",
  description: "ثبت نام در رها استودیو",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{fontFamily:"Tahoma, sans-serif",background: "linear-gradient(135deg, #FFD93D, #FFB100)"}}>
        <div style={{maxWidth:600, margin:"0", background: "linear-gradient(135deg, #FFD93D, #FFB100)", 
          padding:"0 !important", borderRadius:12}}>
          {children}
        </div>
      </body>
    </html>
  );
}
