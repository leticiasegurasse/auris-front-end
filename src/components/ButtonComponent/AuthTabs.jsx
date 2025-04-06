import { useLocation } from "react-router-dom";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

export default function AuthTabs() {
  const { goTo } = useCustomNavigate();
  const location = useLocation();

  const isLogin = location.pathname.includes("login");
  const isRegister = location.pathname.includes("register");

  return (
    <div className="w-full flex justify-center items-center gap-4">
      {/* Botão Login */}
      <button
        onClick={() => goTo("login")}
        className={`py-2 font-bold transition
          ${
            isLogin
              ? "px-4 text-[var(--secondary-color)] border-b-2"
              : "cursor-pointer px-6 rounded-full border-2 border-[var(--secondary-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white"
          }`}
      >
        Login
      </button>

      {/* Botão Registrar */}
      <button
        onClick={() => goTo("register")}
        className={`py-2 font-bold transition
          ${
            isRegister
              ? "px-4 text-[var(--secondary-color)] border-b-2"
              : "cursor-pointer px-6 rounded-full border-2 border-[var(--secondary-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-white"
          }`}
      >
        Registrar
      </button>
    </div>
  );
}
