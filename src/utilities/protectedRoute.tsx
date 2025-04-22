import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../contexts/Context";

const ProtectedRoutes = () => {
    const { isAuthenticated } = useContext(Context);

    if (isAuthenticated === null) {
        // Still checking login state
        return <div style={{ color: "red" }}>Loading...</div>; // or just return null
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoutes;
