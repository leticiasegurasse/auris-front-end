import { useState } from "react";
import { 
    LogOut, 
    User, 
    ChevronDown, 
    ChevronUp,
    Bell,
 } 
from "lucide-react"; // exemplo, caso ainda não tenha importado
import NavbarComponent from "../components/NavbarComponent/NavbarComponent";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useAuth } from "../hooks/useAuth";


function MainLayout ({ children }) {  
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { goTo } = useCustomNavigate();
    const { user, logout } = useAuth();


    return (
        <>
            <div className="flex">
                <NavbarComponent/>
                <div className="w-full">
                    <div className="w-full h-[60px] flex items-center md:justify-end gap-3 p-7 bg-white">
                        {/* <Bell/> */}
                        <div className="relative">
                            {/* Perfil do Usuário */}
                            <div
                                className="flex items-center gap-3 py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-lg transition"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                {/* Avatar com a inicial do usuário */}
                                <div className="w-7 h-7 flex items-center justify-center bg-[var(--primary-color)] text-[var(--light-blue)] text-lg font-bold rounded-3xl shrink-0">
                                    {user?.name_user?.charAt(0).toUpperCase()|| "A"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-800 font-medium text-sm">{user?.name_user || "Usuário"}</p>
                                    {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                                </div>  
                            </div>

                            {/* Submenu Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-10 mt-2 w-full bg-white shadow-lg p-2 border border-gray-200">
                                    <button 
                                        className="flex items-center gap-3 w-full p-2 text-gray-800 text-sm hover:bg-gray-100 rounded-md transition cursor-pointer"
                                        onClick={() => goTo("profile")}
                                    >
                                        <User className="w-5 h-5 text-gray-600" />
                                        Meu perfil
                                    </button>
                                    <button 
                                        className="flex items-center gap-3 w-full p-2 text-gray-800 text-sm hover:bg-gray-100 rounded-md transition cursor-pointer"
                                        onClick={() => logout()}
                                    >
                                        <LogOut className="w-5 h-5 text-gray-600" />
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full min-h-[calc(100vh-60px)] z-10 py-8 px-10">
                        {children}
                    </div>
                </div>
            </div>
            {/* <img
                src={}
                alt="Icone Background"
                className="h-screen fixed top-0 right-0 opacity-40"
            /> */}
        </>
    );
};
export default MainLayout;
