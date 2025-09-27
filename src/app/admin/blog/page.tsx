'use client'

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { getBlogPosts, deleteBlogPost, updateBlogPost } from './actions';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';
import { Edu_NSW_ACT_Cursive } from 'next/font/google';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';

// Initialize the font for the Hero Section.
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['400', '700'], // You can specify the weights you need
  subsets: ['latin'],
  fallback: ['cursive'],
});

const POSTS_PER_PAGE = 10

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      const { posts, count } = await getBlogPosts(searchTerm, statusFilter, currentPage, POSTS_PER_PAGE);
      setBlogPosts(posts as BlogPost[]);
      setTotalPosts(count);
      setLoading(false);
    };
    fetchBlogPosts();
  }, [searchTerm, statusFilter, currentPage]);

  const handlePublishToggle = async (post: BlogPost) => {
    const formData = new FormData();
    formData.append('id', post.id.toString());
    formData.append('title', post.title);
    formData.append('slug', post.slug);
    formData.append('content', JSON.stringify(post.content));
    formData.append('excerpt', post.excerpt || '');
    formData.append('image_url', post.image_url || '');
    if (post.published_at) {
      formData.append('published_at', '');
    } else {
      formData.append('published_at', new Date().toISOString());
    }
    await updateBlogPost(formData);
    const { posts, count } = await getBlogPosts(searchTerm, statusFilter, currentPage, POSTS_PER_PAGE);
    setBlogPosts(posts as BlogPost[]);
    setTotalPosts(count);
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className={`min-h-screen bg-gray-100 ${loading ? 'loading-cursor' : ''}`}>
      <AdminHeader title="Gestión de Blog" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold text-gray-900 ${eduNSW.className}`}>Entradas de Blog Existentes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
              >
                <option value="all">Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Publicación</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Borrador'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <Link href={`/admin/blog/${post.slug}`} className="text-indigo-600 hover:text-indigo-900">
                            <FaEdit size={18} />
                          </Link>
                          <form action={async () => { await deleteBlogPost(post.id); const { posts, count } = await getBlogPosts(searchTerm, statusFilter, currentPage, POSTS_PER_PAGE); setBlogPosts(posts as BlogPost[]); setTotalPosts(count); }}>
                            <button type="submit" className="text-red-600 hover:text-red-900">
                              <FaTrash size={18} />
                            </button>
                          </form>
                          <button onClick={() => handlePublishToggle(post)} className="text-gray-600 hover:text-gray-900">
                            {post.published_at ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-bold">{(currentPage - 1) * POSTS_PER_PAGE + 1}</span> a <span className="font-bold">{Math.min(currentPage * POSTS_PER_PAGE, totalPosts)}</span> de <span className="font-bold">{totalPosts}</span> resultados
              </div>
              <nav aria-label="Pagination">
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleLeft />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 leading-tight border border-gray-300 ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white'} hover:bg-gray-100 hover:text-gray-700`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaAngleDoubleRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}