import React from "react";

function Button({
  children, // Texto dentro do botão
  variant = "primary", // Estilo do botão (padrão: primary)
  size = "md", // Tamanho do botão (padrão: md)
  icon: Icon, // Ícone opcional (componente React)
  onClick, // Evento de clique
  disabled = false, // Desabilitar botão
  className = "cursor-pointer", // Classes extras
}) {
  // Estilos baseados na variante
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer",
    secondary: "bg-[var(--light-green)] hover:bg-[var(--light-green)] text-white shadow cursor-pointer",
    cta: "bg-[var(--orange)] hover:bg-[#D19119] text-white cursor-pointer",
    transparent: "text-[var(--primary-color)] cursor-pointer",
    success: "bg-green-500 hover:bg-green-600 text-white cursor-pointer",
    danger: "bg-[var(--red)] hover:bg-red-600 text-white cursor-pointer",
    outline: "border border-gray-500 text-gray-500 hover:bg-gray-100 cursor-pointer",
  };

  // Tamanhos do botão
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    full: "w-full px-4 py-3 text-sm",
    full_lg: "w-full px-3 py-2 text-lg",
    half: "w-2/4 px-3 py-2 text-sm",
  };

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-md transition-all duration-200 
        ${variants[variant]} ${sizes[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="w-5 h-5" />} {/* Ícone opcional */}
      {children}
    </button>
  );
}

export default Button;
