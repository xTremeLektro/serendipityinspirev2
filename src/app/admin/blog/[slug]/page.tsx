import EditBlogPostForm from './EditBlogPostForm';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <EditBlogPostForm
      slug={params.slug}
    />
  );
}
