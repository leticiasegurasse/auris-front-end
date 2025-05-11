import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white p-3 rounded-full shadow-sm hover:shadow-md"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="mt-1 text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 