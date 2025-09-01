import AdminHeader from '@/components/AdminHeader';
import QuoteRequestDetailsClient from './QuoteRequestDetailsClient';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/utils';

export default async function QuoteRequestDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const numericId = parseInt((await params).id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const { data: quoteRequest, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error || !quoteRequest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Detalles de la Solicitud de Presupuesto" backUrl="/admin/budget" backText="Regresar a Solicitudes de Presupuesto" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <QuoteRequestDetailsClient quoteRequest={quoteRequest} />
        </div>
      </main>
    </div>
  );
}