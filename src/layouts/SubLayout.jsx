import { 
    LogOut, 
    User, 
    ChevronDown, 
    ChevronUp,
    Bell,
 } 
from "lucide-react"; // exemplo, caso ainda não tenha importado


function SubLayout ({ children }) {  

    return (
        <>
            <div className="w-full min-h-screen p-4 min-h-screen flex items-center justify-center bg-[var(--secondary-color)]">
                {children}
            </div>
            {/* <img
                src={}
                alt="Icone Background"
                className="h-screen fixed top-0 right-0 opacity-40"
            /> */}
        </>
    );
};
export default SubLayout;
