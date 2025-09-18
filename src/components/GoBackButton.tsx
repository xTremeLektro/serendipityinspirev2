'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors duration-300"
    >
      <ArrowLeft size={20} />
      Volver
    </button>
  );
};

export default GoBackButton;
