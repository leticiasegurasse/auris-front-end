import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from './ButtonComponent';
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

const BackButton = () => {
  const { goBack } = useCustomNavigate();

  return (
      <div className="flex items-center gap-4 mb-8">
          <button 
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white p-3 rounded-full shadow-sm hover:shadow-md cursor-pointer"
          >
              <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">titulo</h1>
          <p>descrição</p>
      </div>
  );
};

export default BackButton;
