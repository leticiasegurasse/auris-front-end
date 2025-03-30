import NavbarComponent from "../components/NavbarComponent/NavbarComponent";

const MainLayout = ({ children }) => (
    <>
        <div className="flex">
            <NavbarComponent/>
            <div className="w-full min-h-screen z-10 p-4 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
        {/* <img
            src={}
            alt="Icone Background"
            className="h-screen fixed top-0 right-0 opacity-40"
        /> */}
    </>
);
export default MainLayout;
