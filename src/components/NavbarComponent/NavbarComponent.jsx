import { useState } from "react";
import { useLocation } from "react-router-dom";
import IconLogo from "../../assets/icons/icon.png"
import LogoFull from "../../assets/logos/logo.png"
import { ROUTES } from "../../config/routes";
// import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Activity,
  ClipboardPlus,
  UserRound,
  CalendarCheck,
  Headset,
  ChevronLeft,
} from "lucide-react";

function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false); // Menu aberto por padrão
  const [isCollapsed, setIsCollapsed] = useState(false); // Para recolher em telas grandes

  const location = useLocation(); // Obtém a URL atual
//   const { user, signOut } = useAuth();

  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className={`${isCollapsed ? "md:w-20" : "md:w-[400px] lg:w-[340px]"} transition-all`}>
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
          <img
            src={isCollapsed ? IconLogo : LogoFull}
            alt="Logo"
            className={`transition-all h-10`}
          />
        </div>

        {/* Botão Nova Consulta */}
        {/* {!isCollapsed ? (
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
        )} */}

        {/* Links do Menu */}
        <nav className="w-10/12 py-7 space-y-4 border-t border-gray-100">
          <ul className="space-y-4">
            {[
              { name: "Home", icon: Home, path: ROUTES.home },
              { name: "Dashboard", icon: LayoutDashboard, path: ROUTES.dashboard },
              { name: "Pacientes", icon: UserRound, path: ROUTES.patients },
              { name: "Evoluções", icon: Activity, path: ROUTES.evolution },
              { name: "Exercícios", icon: ClipboardPlus, path: ROUTES.exercises },
              { name: "Agenda", icon: CalendarCheck, path: ROUTES.calendar },
            ].map((item) => (
              <li
                key={item.name}
                className={`flex flex-col items-center ${
                  location.pathname === item.path ? "" : ""
                }`}
              >
                <a
                  href={item.path}
                  className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 py-4 px-4 rounded-md transition duration-300 hover:bg-[var(--light-blue)] group
                  ${
                    location.pathname === item.path ? "bg-gray-100" : ""
                  }`}
                >
                  <item.icon 
                    className={`transition duration-100 ${isCollapsed ? "w-5 h-5" : "w-4 h-4"} ${
                      location.pathname === item.path ? "text-[var(--secondary-color)]" : "text-gray-600 group-hover:text-[var(--secondary-color)]"
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
              </li>
            ))}

            {/* Menu de Ajuda e Suporte */}
            <li className="w-[90%] border-t border-gray-100 pt-4 group">
              <a
                href="https://wa.me/5522996057202"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 py-2 px-4 rounded-md`}
              >
                <Headset className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4"} text-gray-600 group-hover:text-[var(--secondary-color)]`} />
                {!isCollapsed && <span className="text-gray-800">Ajuda e Suporte</span>}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default NavbarComponent;
