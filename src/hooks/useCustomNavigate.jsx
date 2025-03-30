import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";

export function useCustomNavigate() {
  const navigate = useNavigate();

  // Função para navegação padrão
  function goTo(path, params = {}) {
    const route = ROUTES[path].replace(/:([a-zA-Z_]+)/g, (_, key) => params[key]);
    navigate(route);
  }

  // Função para navegação com atraso (útil para mensagens antes da navegação)
  function goToWithDelay(path, delay = 1000) {
    setTimeout(() => {
      navigate(ROUTES[path]);
    }, delay);
  }

  // Função para voltar à página anterior
  function goBack() {
    navigate(-1);
  }

  // Função para navegar com estado extra
  function goToWithState(path, state) {
    navigate(ROUTES[path], { state });
  }

  return {
    goTo,
    goToWithDelay,
    goBack,
    goToWithState,
  };
}
