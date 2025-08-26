import Link from 'next/link'
import { Edu_NSW_ACT_Cursive } from 'next/font/google';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
});

export default function AdminHeader({ title, backUrl, backText }: { title: string, backUrl?: string, backText?: string }) {
  const returnUrl = backUrl || "/admin/dashboard";
  const returnText = backText || "Regresar al Dashboard";

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className={`text-3xl font-bold text-gray-900 ${eduNSW.className}`}>{title}</h1>
        <Link href={returnUrl}>
          <div className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            {returnText}
          </div>
        </Link>
      </div>
    </header>
  )
}