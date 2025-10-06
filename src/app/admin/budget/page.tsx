import AdminHeader from '@/components/AdminHeader';
import { getQuoteRequests } from './actions';
import QuoteRequestsClient from './QuoteRequestsClient';

const QUOTES_PER_PAGE = 15;

export default async function AdminBudgetPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const pageParam = (await searchParams)?.page;
  const currentPage = Number(pageParam) || 1;
  const { data, count } = await getQuoteRequests(currentPage, QUOTES_PER_PAGE);

  const totalQuoteRequests = count || 0;
  const totalPages = Math.ceil(totalQuoteRequests / QUOTES_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader title="Solicitudes de Presupuesto" />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <QuoteRequestsClient
            quoteRequests={data || []}
            totalPages={totalPages}
            currentPage={currentPage}
            totalQuoteRequests={totalQuoteRequests}
          />
        </div>
      </main>
    </div>
  );
}
