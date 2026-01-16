import { PrismaClient, AgeRange } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a test user with profile
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      authProviderId: 'test-auth-id-123',
      profile: {
        create: {
          ageRange: AgeRange.ADULT,
          preferredLanguage: 'en',
          consentVersion: '1.0',
          consentedAt: new Date(),
        },
      },
    },
    include: {
      profile: true,
    },
  })

  console.log('✅ Seed user created:', {
    id: user.id,
    email: user.email,
    profile: {
      ageRange: user.profile?.ageRange,
      consentVersion: user.profile?.consentVersion,
    },
  })

  // Create a teen user without consent (for testing)
  const teenUser = await prisma.user.create({
    data: {
      email: 'teen@example.com',
      authProviderId: 'teen-auth-id-456',
      profile: {
        create: {
          ageRange: AgeRange.TEEN,
          preferredLanguage: 'en',
          // No consent yet
        },
      },
    },
    include: {
      profile: true,
    },
  })

  console.log('✅ Teen user created (no consent):', {
    id: teenUser.id,
    email: teenUser.email,
    profile: {
      ageRange: teenUser.profile?.ageRange,
      consentVersion: teenUser.profile?.consentVersion,
    },
  })

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
