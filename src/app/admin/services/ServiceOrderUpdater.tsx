"use client";

import React, { useState } from 'react';
import { updateServiceOrder } from './actions';
import { useFormStatus } from 'react-dom';

interface ServiceOrderUpdaterProps {
  serviceId: string;
  initialOrder: number | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:bg-indigo-400">
      {pending ? 'Updating...' : 'Update'}
    </button>
  );
}

const ServiceOrderUpdater: React.FC<ServiceOrderUpdaterProps> = ({ serviceId, initialOrder }) => {
  const [order, setOrder] = useState<number | null>(initialOrder);

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(parseInt(e.target.value));
  };

  const updateOrderWithId = updateServiceOrder.bind(null, serviceId);

  return (
    <form action={updateOrderWithId} className="flex items-center">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input
        type="number"
        name="ord"
        value={order || ''}
        onChange={handleOrderChange}
        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900"
      />
      <SubmitButton />
    </form>
  );
};

export default ServiceOrderUpdater;
