import { getAllBlogPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import TiptapRenderer from '@/components/TiptapRenderer';
import GoBackButton from '@/components/GoBackButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// This function generates the static paths for each blog post at build time.
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className={`${inter.variable} font-sans bg-white text-slate-800`}>
      <article className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <GoBackButton />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">{post.title}</h1>
          <p className="text-center text-slate-500 mb-8">{formattedDate}</p>

          {/* The main content of the blog post */}
          <TiptapRenderer content={post.content || ''} />

          <div className="mt-12 text-center">
            <GoBackButton />
          </div>
        </div>
      </article>
    </main>
  );
}
