import { Navigate, Outlet } from "react-router-dom";
import React from "react";

// const isAuthenticated = async () => {
//     const token = localStorage.getItem("authToken");
//     const tokenExpiration = localStorage.getItem("tokenExpiration");

//     if (!token || !tokenExpiration) return false;

//     const now = new Date().getTime();
//     if (now > Number(tokenExpiration)) {
//         await refreshToken();
//         return true;
//     }

//     return true;
// };

const ProtectedRoute = () => {
//     const [isAuth, setIsAuth] = React.useState(null);

//     React.useEffect(() => {
//         const checkAuth = async () => {
//             const authStatus = await isAuthenticated();
//             setIsAuth(authStatus);
//         };

//         checkAuth();
//     }, []);

//     // Durante a verificação, renderize nada ou um loading
//     if (isAuth === null) {
//         return <div>Loading...</div>; // Ou qualquer outro componente de loading
//     }

//     return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
