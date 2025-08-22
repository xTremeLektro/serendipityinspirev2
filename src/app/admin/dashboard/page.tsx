import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/admin/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-700">Welcome, {user.email}!</p>
        <p className="text-gray-700 mt-4">This is a protected admin area.</p>
        <form action={handleSignOut}>
          <button
            className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
