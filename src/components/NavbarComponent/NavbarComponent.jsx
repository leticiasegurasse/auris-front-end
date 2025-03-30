import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
// import { useAuth } from "../../context/AuthContext";
import { userMock } from "../../mocks/userMock";
import {
  Menu,
  X,
  Home,
  Clock,
  CalendarCheck,
  HelpCircle,
  ChevronLeft,
  User,
  LogOut
} from "lucide-react";

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false); // Menu aberto por padrão
  const [isCollapsed, setIsCollapsed] = useState(false); // Para recolher em telas grandes
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation(); // Obtém a URL atual
  const { goTo } = useCustomNavigate();
//   const { user, signOut } = useAuth();

  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className={`${isCollapsed ? "md:w-25" : "md:w-[390px]"} transition-all`}>
      {/* Botão para abrir menu no mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 right-4 z-50 bg-[var(--primary-color)] cursor-pointer text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`flex flex-col items-center gap-7 py-3 fixed ${
          isCollapsed ? "w-20" : "w-[290px]"
        } bg-white h-screen shadow-lg transition-all z-40 ${
          isOpen ? "left-0" : "-left-[290px]"
        } md:left-0`}
      >
        {/* Botão para recolher menu em telas grandes */}
        <button
          onClick={toggleCollapse}
          className="hidden md:block absolute top-4 -right-3 bg-gray-200 p-1 rounded-lg hover:bg-gray-300 transition cursor-pointer"
        >
          <ChevronLeft className={`w-6 h-6 transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mt-6">
          {/* <img
            src={isCollapsed ? IconLogo : LogoFull}
            alt="Logo"
            className={`transition-all h-10`}
          /> */}
        </div>

        {/* Botão Nova Consulta */}
        {!isCollapsed ? (
          <button
            onClick={() => goTo("new_audio_captures")}
            className="w-[90%] p-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--dark-blue)] transition cursor-pointer"
          >
            + Nova consulta
          </button>
        ) : (
          <button
            onClick={() => goTo("new_audio_captures")}
            className="w-12 h-12 flex items-center justify-center bg-[var(--primary-color)] text-white text-xl rounded-lg hover:bg-[var(--dark-blue)] transition cursor-pointer"
          >
            +
          </button>
        )}

        {/* Links do Menu */}
        <nav className="w-full pt-7 space-y-4 border-t border-gray-200">
          {[
            { name: "Home", icon: Home, path: "/" },
            { name: "Consultas Realizadas", icon: CalendarCheck, path: "/split_assist/audio_captures" },
          ].map((item) => (
            <span
              key={item.name}
              className={`flex flex-col items-center hover:border-l-4 hover:border-[var(--primary-color)] hover:bg-gray-100 ${
                location.pathname === item.path ? "border-l-4 border-[var(--primary-color)]" : ""
              }`}
            >
              <a
                href={item.path}
                className={`w-[90%] flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 py-4 px-4 rounded-md hover:bg-gray-100 group
                ${
                  location.pathname === item.path ? "bg-gray-100" : ""
                }`}
              >
                <item.icon 
                  className={`w-4 h-4 transition duration-200 ${
                    location.pathname === item.path ? "text-[var(--primary-color)]" : "text-gray-600 group-hover:text-[var(--primary-color)]"
                  }`} 
                />
                {!isCollapsed && (
                  <span
                    className={`transition duration-200 ${
                      location.pathname === item.path ? "text-[var(--primary-color)]" : "text-gray-800 group-hover:text-[var(--primary-color)]"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </a>
            </span>
          ))}
        </nav>

        {/* Seção de Ajuda e Suporte */}
        <div className="w-full flex flex-col items-center mt-auto">
          <div className="w-[90%] border-t border-gray-200 pt-4 group">
            <a
              href="https://wa.me/5511959327581?text=Ol%C3%A1!"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 py-2 px-4 rounded-md`}
            >
              <HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-[var(--primary-color)]" />
              {!isCollapsed && <span className="text-gray-800">Ajuda e Suporte</span>}
            </a>
          </div>

          <div className="w-[90%] relative mt-3">
            {/* Perfil do Usuário */}
            <div
              className="flex items-center gap-3 py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-lg transition"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              {/* Avatar com a inicial do usuário */}
              <div className="w-9 h-9 flex items-center justify-center bg-[var(--secondary-color)] text-[var(--dark-blue)] text-xl font-bold rounded-lg">
                {userMock?.name?.charAt(0)}
              </div>

              {/* Nome e Email (se não estiver colapsado) */}
              {!isCollapsed && (
                <div>
                  <p className="text-gray-800 font-medium">{userMock?.name || "Usuário"}</p>
                  <p className="text-gray-500 text-sm">{userMock?.email || "email@example.com"}</p>
                </div>
              )}
            </div>

            {/* Submenu Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 bottom-17 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                <button 
                  className="flex items-center gap-3 w-full p-2 text-gray-800 hover:bg-gray-100 rounded-md transition cursor-pointer"
                  onClick={() => goTo("profile")}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  Meu perfil
                </button>
                <button className="flex items-center gap-3 w-full p-2 text-gray-800 hover:bg-gray-100 rounded-md transition cursor-pointer">
                  <LogOut className="w-5 h-5 text-gray-600" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default NavbarComponent;
