import { getAllBlogPostsForDisplay } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function BlogPage() {
  const posts = await getAllBlogPostsForDisplay();

  return (
    <main className={`${inter.variable} font-sans bg-slate-50 text-slate-800`}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold">Nuestro Blog</h1>
            <p className="text-lg text-slate-600 mt-2">Explora nuestras ideas, consejos y las últimas tendencias en diseño de interiores. <Link href="/contact" className="text-[#E67E22] hover:underline">Suscríbete aquí</Link> para no perderte ninguna novedad.</p>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Próximamente</h2>
              <p className="text-slate-500">Estamos trabajando en nuevo contenido. ¡Vuelve pronto!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
