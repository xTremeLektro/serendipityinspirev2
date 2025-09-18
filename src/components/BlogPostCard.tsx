import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} key={post.id}>
      <div className="group project-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
        <div className="overflow-hidden h-56 w-full relative">
          <Image
            src={post.image_url || "/images/0000 - Public Serendipity Site v2/carrousel1.jpg"}
            alt={`Imagen del post ${post.title}`}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <p className="text-sm text-slate-500 mb-2">{formattedDate}</p>
          <h3 className="text-xl font-bold mb-2 flex-grow">{post.title}</h3>
          <p className="text-slate-600 mb-4">{post.excerpt}</p>
          <span className="font-semibold text-[#E67E22] group-hover:underline mt-auto inline-flex items-center gap-1">
            Leer Más <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
