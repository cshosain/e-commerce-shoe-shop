import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const userStr = localStorage.getItem("user");
    let isSessionValid = false;
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.sessionExpire && Date.now() < user.sessionExpire) {
            isSessionValid = true;
        }
    }

    return isSessionValid ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoutes;
