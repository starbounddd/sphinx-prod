import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import type { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable')
  }

  // Get headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify webhook signature
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle events
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses } = evt.data
      // Create user in PostgreSQL
      await prisma.user.create({
        data: {
          authProviderId: id,
          email: email_addresses[0]?.email_address,
          profile: {
            create: {
              ageRange: 'UNSPECIFIED',
              preferredLanguage: 'en',
            },
          },
        },
      })
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data
      // Update user email if changed
      await prisma.user.update({
        where: { authProviderId: id },
        data: {
          email: email_addresses[0]?.email_address,
        },
      })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data
      // Delete user from database
      await prisma.user.delete({
        where: { authProviderId: id as string },
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Database operation failed:', error)
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    )
  }
}
