import EditBlogPostForm from './EditBlogPostForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <EditBlogPostForm
      slug={slug}
    />
  );
}