// src/components/AlertComponent/AlertMessage.jsx
import { X, XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

const variants = {
  success: {
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-800",
  },
  error: {
    icon: <XCircle className="text-red-600 w-5 h-5" />,
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-800",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-800",
  },
  info: {
    icon: <Info className="text-blue-600 w-5 h-5" />,
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-800",
  },
};

const AlertMessage = ({ message, type = "info", onClose, className = "" }) => {
  const style = variants[type] || variants.info;

  return (
    <div className={`relative w-full flex items-center justify-between gap-3 p-3 rounded-md border ${style.bg} ${style.border} ${style.text} ${className}`}>
      <div className="flex items-center gap-3">
        {/* Ícone de status */}
        <div className="pt-[2px]">{style.icon}</div>

        {/* Mensagem */}
        <span className="text-sm">{message}</span>
      </div>

      {/* Botão de fechar */}
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.text} hover:text-gray-800 transition cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
