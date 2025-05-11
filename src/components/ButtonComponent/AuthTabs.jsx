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
        onClick={() => goTo("LOGIN")}
        className={`py-2 font-bold transition
          ${
            isLogin
              ? "px-4 text-white border-b-2"
              : "cursor-pointer px-6 rounded-full text-[var(--light-blue)] hover:bg-[var(--light-green)] hover:text-white"
          }`}
      >
        Login
      </button>

      {/* Botão Registrar */}
      <button
        onClick={() => goTo("REGISTER")}
        className={`py-2 font-bold transition
          ${
            isRegister
              ? "px-4 text-white border-b-2"
              : "cursor-pointer px-6 rounded-full text-white hover:bg-[var(--light-green)] hover:text-white"
          }`}
      >
        Registrar
      </button>
    </div>
  );
}
