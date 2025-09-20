import { getBlogPost } from '../actions';
import EditBlogPostForm from './EditBlogPostForm';
import AdminHeader from '@/components/AdminHeader';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader title="Blog Post Not Found" backUrl="/admin/blog" backText="Return to Blog Posts" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
              <p className="text-gray-700">The requested blog post could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <EditBlogPostForm
      post={blogPost}
    />
  );
}
