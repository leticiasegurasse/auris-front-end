import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const PaymentConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-gray-600">
            Seu pagamento foi processado com sucesso. Obrigado pela sua compra!
          </p>

          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Voltar para a tela de login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage; 