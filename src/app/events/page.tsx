'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Events() {
  const session = useSession()

  return (
    <>
      Hello {session.data?.user?.email} <br></br>
      <Link href="/">Back to home</Link>
    </>
  )
}
