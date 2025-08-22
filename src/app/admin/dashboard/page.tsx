import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/admin/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }

  const managementSections = [
    {
      title: 'Carousel',
      href: '/admin/carousel',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      description: 'Manage the images in the main carousel.',
    },
    {
      title: 'Projects',
      href: '/admin/projects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.92-1.75l5.25-3.18a2.25 2.25 0 012.16 0l5.25 3.18a2.25 2.25 0 01.92 1.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25v-2.34a2.25 2.25 0 00-2.25-2.25h-3.75a2.25 2.25 0 00-2.25 2.25v2.34M15.75 8.25a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25M15.75 8.25L12 6.75l-3.75 1.5" />
        </svg>
      ),
      description: 'Manage the projects displayed on the site.',
    },
    {
      title: 'Services',
      href: '/admin/services',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l-4.24-4.24a5.25 5.25 0 010-7.42L11.42 15.17z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l-2.25-2.25" />
        </svg>
      ),
      description: 'Manage the services offered.',
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      description: 'Manage blog posts (Future).',
    },
    {
      title: 'Contacts',
      href: '/admin/contacts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.371c-1.13.113-2.07-1.03-1.57-2.116l.218-.363a1.5 1.5 0 012.43-.39l1.495 1.494a1.5 1.5 0 002.122 0l2.828-2.828a1.5 1.5 0 000-2.122l-1.495-1.494a1.5 1.5 0 01.39-2.43l.363-.218a1.5 1.5 0 012.116 1.57zM3.75 8.511c-.884.284-1.5 1.128-1.5 2.097v4.286c0 1.136.847 2.1 1.98 2.193l3.722.371c1.13.113 2.07-1.03 1.57-2.116l-.218-.363a1.5 1.5 0 01-2.43-.39L5.03 14.25a1.5 1.5 0 00-2.122 0L.08 17.178a1.5 1.5 0 000 2.122l1.495 1.494a1.5 1.5 0 01-.39 2.43l-.363.218a1.5 1.5 0 01-2.116-1.57z" />
        </svg>
      ),
      description: 'Review contact form submissions.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-3xl font-bold text-gray-900 ${eduNSW.className}`}>Admin Dashboard</h1>
          <form action={handleSignOut}>
            <button
              className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {managementSections.map((section) => (
                <Link href={section.href} key={section.title} className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer`}>
                  <div className="p-5 text-center">
                    {section.icon}
                    <h3 className={`text-lg font-bold text-gray-900 ${eduNSW.className}`}>{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}