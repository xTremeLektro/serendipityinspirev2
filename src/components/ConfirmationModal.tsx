
'use client';


import Image from 'next/image';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, title, message, isSuccess }) => {
  if (!isOpen) return null;

  const logoImage = '/images/serendipity-svg/LOGO-3.svg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <Image
            src={logoImage}
            alt="Serendipity Logo"
            width={120}
            height={30}
            className="h-10 w-auto"
          />
        </div>
        <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-[#E67E22] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#d35400] transition-colors duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
