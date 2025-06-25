import { Outlet, Navigate } from "react-router-dom";
import useIsLoggedIn from "../customHooks/useIsLoggedIn.ts"; // Import the custom hook

const ProtectedRoutes = () => {
    const isLoggedIn = useIsLoggedIn();

    if (isLoggedIn === null) {
        // Still checking login state
        return <div style={{ color: "red" }}>Loading...</div>; // or just return null
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoutes;
