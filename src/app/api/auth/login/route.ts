import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE,
  AuthRole,
  authCookieOptions,
  createSessionToken,
  validateCredentials,
} from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const password = String(body?.password ?? '').trim();
    const role = String(body?.role ?? '').trim() as AuthRole;

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
    }

    const user = validateCredentials(email, password, role);
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role !== role) {
      return NextResponse.json({ message: `Account exists but not as ${role}` }, { status: 403 });
    }

    const token = createSessionToken(user);
    const res = NextResponse.json({ user });
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions);
    return res;
  } catch {
    return NextResponse.json({ message: 'Invalid request payload' }, { status: 400 });
  }
}
