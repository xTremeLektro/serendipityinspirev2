import Image from "next/image";
import Link from "next/link";
import ExpandingCards from "@/components/ExpandingCards";
import { Edu_NSW_ACT_Cursive, Inter } from 'next/font/google';
import { getHomeProjects } from "@/lib/projects";
import { getLatestBlogPosts } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";
import { ArrowRight } from 'lucide-react'; // Using lucide-react for icons, you may need to install it: npm install lucide-react

// Initialize the fonts
const eduNSW = Edu_NSW_ACT_Cursive({
  weight: ['700'],
  subsets: ['latin'],
  fallback: ['cursive'],
  variable: '--font-edu-nsw',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function Home() {
  const projects = await getHomeProjects();
  const latestPosts = await getLatestBlogPosts(3);

  return (
    <main className={`${inter.variable} ${eduNSW.variable} font-sans bg-slate-50 text-slate-800`}>
      
      {/* --- Hero Section --- */}
      {/* A more immersive hero section that uses the expanding cards as a full-width background. */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ExpandingCards />
          {/* Adding a dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 p-8">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-shadow-lg">Diseño de Interiores que Inspira</h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto text-shadow ${eduNSW.className}`}>Transformamos tus espacios en lugares únicos y funcionales.</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 shadow-lg">
            Comienza tu Proyecto <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* --- Our Process Section --- */}
      {/* This section creatively uses your SVG files to showcase your services or process. */}
      <section className="py-10 bg-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Nuestro Proceso Creativo</h2>
            <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">Desde la idea inicial hasta el último detalle, te acompañamos en cada paso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Item 1: Idea */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-full shadow-md mb-4">
                <Image src="/images/serendipity-svg/IDEA.svg" alt="Idea" width={50} height={50} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">1. Conceptualización</h3>
              <p className="text-slate-600">Escuchamos tus ideas y necesidades para crear un concepto único y personalizado.</p>
            </div>
            {/* Item 2: Notes */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-full shadow-md mb-4">
                <Image src="/images/serendipity-svg/NOTES.svg" alt="Notes" width={50} height={50} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">2. Diseño y Planificación</h3>
              <p className="text-slate-600">Desarrollamos planos detallados, seleccionamos materiales y definimos cada aspecto del proyecto.</p>
            </div>
            {/* Item 3: Paint */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-full shadow-md mb-4">
                <Image src="/images/serendipity-svg/PAINT.svg" alt="Paint" width={50} height={50} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">3. Ejecución y Entrega</h3>
              <p className="text-slate-600">Coordinamos la ejecución de la obra, cuidando la calidad hasta la entrega final del espacio soñado.</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-lg">
              Ver Servicios <ArrowRight size={20} />
            </Link>
        </div>
      </section>

      {/* --- Featured Projects Section --- */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Proyectos Destacados</h2>
            <p className="text-lg text-slate-600 mt-2">Un vistazo a nuestros trabajos más recientes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link href={`/portfolio/${project.id}`} key={project.id}>
                <div className="group project-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="overflow-hidden h-56">
                    <Image
                      src={project.project_pics[0]?.photo_url || "/images/0000 - Public Serendipity Site v2/carrousel1.jpg"}
                      alt={`Imagen del Proyecto ${project.project_name}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.project_name}</h3>
                    <p className="text-slate-600 mb-4">{project.short_description}</p>
                    <span className="font-semibold text-[#E67E22] group-hover:underline">Ver Proyecto</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/portfolio" className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-lg">
              Ver Portfolio Completo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Blog Section --- */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Desde Nuestro Blog</h2>
            <p className="text-lg text-slate-600 mt-2">Ideas, tendencias e inspiración para tus próximos proyectos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-lg">
              Visita Nuestro Blog <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- About Us CTA --- */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex items-center">
            <div className="md:w-1/4">
                <Image src="/images/0000 - Public Serendipity Site v2/photo-output.PNG" alt="Nuestro equipo" width={800} height={600} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-12">
              <h2 className="text-3xl font-bold mb-4">Apasionados por el Diseño</h2>
              <p className="text-lg text-slate-600 mb-6">Somos un equipo de creativos comprometidos con la excelencia, la innovación y la creación de espacios que cuentan una historia.</p>
              <Link href="/about" className="inline-flex items-center gap-2 bg-[#E67E22] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 shadow-lg">
                Conoce al Equipo <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}