import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE,
  authCookieOptions,
  createSessionToken,
  registerUser,
} from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const phone = String(body?.phone ?? '').trim();
    const password = String(body?.password ?? '').trim();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 5) {
      return NextResponse.json({ message: 'Password must be at least 5 characters' }, { status: 400 });
    }

    const result = registerUser({ name, email, phone, password, role: 'customer' });
    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: 409 });
    }

    const token = createSessionToken(result.user);
    const res = NextResponse.json({ user: result.user });
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions);
    return res;
  } catch {
    return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
  }
}
