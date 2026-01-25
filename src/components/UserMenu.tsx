'use client'

import { UserButton } from '@clerk/nextjs'

export function UserMenu() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
