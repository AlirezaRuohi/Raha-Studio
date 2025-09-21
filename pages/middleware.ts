// middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import crypto from 'crypto'

const RS_SECRET = process.env.RS_SECRET! // همان ADMIN_KEY یا کلید مشترک

function verify(token: string): boolean {
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;
  const expected = crypto.createHmac('sha256', RS_SECRET).update(payloadB64).digest('hex');
  if (sig !== expected) return false;

  const json = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
  if (!json.exp || Date.now() / 1000 > json.exp) return false;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // مسیری که ثبت‌نام/احراز را نشان می‌دهد را عمومی بگذار
  if (pathname.startsWith('/register') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('rs_auth')?.value || '';
  const ok = token && verify(token);

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = '/register';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// مشخص کن روی کدام مسیرها اعمال شود (همه به جز فایل‌های استاتیک)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
