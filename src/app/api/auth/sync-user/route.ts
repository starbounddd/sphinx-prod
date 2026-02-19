import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';

/**
 * Sync the current Supabase auth user to Postgres (User + UserProfile).
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authProviderId = user.id;
  const email = user.email ?? null;

  try {
    const existing = await prisma.user.findUnique({
      where: { authProviderId },
      include: { profile: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { email },
      });
      return NextResponse.json({
        ok: true,
        userId: existing.id,
        action: 'updated',
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        authProviderId,
        profile: {
          create: {},
        },
      },
    });

    return NextResponse.json({
      ok: true,
      userId: newUser.id,
      action: 'created',
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('sync-user error', e);
    return NextResponse.json(
      {
        error: 'Failed to sync user to database',
        details: message,
      },
      { status: 500 }
    );
  }
}
