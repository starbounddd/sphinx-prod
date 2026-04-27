import { NextResponse } from 'next/server';

import { Prisma } from '@/lib/db/interest-list-client';
import { interestListPrisma } from '@/lib/db/interestListPrisma';
import { validateEmail } from '@/utils/validation';

export async function POST(request: Request) {
  try {
    if (!process.env.INTEREST_LIST_DATABASE_URL?.trim()) {
      console.error('[interest-signup] INTEREST_LIST_DATABASE_URL is not configured');
      return NextResponse.json(
        { error: 'Signups are temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { email?: unknown };
    const raw = typeof body.email === 'string' ? body.email.trim() : '';

    if (!raw || !validateEmail(raw)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const email = raw.toLowerCase();

    try {
      await interestListPrisma.interestListSignup.create({
        data: { email },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        return NextResponse.json({ success: true, alreadyOnList: true });
      }
      throw e;
    }

    return NextResponse.json({ success: true, alreadyOnList: false });
  } catch (error) {
    console.error('[interest-signup]', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
