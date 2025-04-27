import React from 'react';
import { ArrowBigLeftDash } from 'lucide-react';
import Button from './ButtonComponent';
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

const BackButton = () => {
  const { goBack } = useCustomNavigate();

  return (
    <div className="w-full">
      <Button 
        variant="transparent" 
        icon={ArrowBigLeftDash} 
        onClick={goBack}
      >
        Voltar
      </Button>
    </div>
  );
};

export default BackButton;
