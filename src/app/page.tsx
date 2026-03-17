import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to login as the default landing
  redirect('/login')
}
