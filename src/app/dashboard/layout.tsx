import { authOptions } from '@/server/AuthOptions'
import { getServerSession } from 'next-auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <>unauthorized</>
  }

  return <div>{children}</div>
}
