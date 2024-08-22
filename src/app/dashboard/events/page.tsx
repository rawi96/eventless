import { authOptions } from '@/server/AuthOptions'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function Events() {
  const session = await getServerSession(authOptions)

  return (
    <>
      Hello {session?.user?.email} <br></br>
      <Link href="/">Back to home</Link>
    </>
  )
}
