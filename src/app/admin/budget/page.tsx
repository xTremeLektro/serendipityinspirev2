import AdminHeader from '@/components/AdminHeader';
import QuoteRequestsClient from './QuoteRequestsClient';
import { createSupabaseServerClient } from '@/lib/supabase/utils';

export default async function AdminBudgetPage() {
  const supabase = createSupabaseServerClient();
  const { data: quoteRequests, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quote requests:', error);
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Solicitudes de Presupuesto" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <QuoteRequestsClient quoteRequests={quoteRequests || []} />
        </div>
      </main>
    </div>
  );
}
