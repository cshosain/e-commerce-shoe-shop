import { Outlet, Navigate } from "react-router-dom";
import useIsLoggedIn from "../customHooks/useIsLoggedIn.ts"; // Import the custom hook
import Home from "../pages/home/Home.tsx";
import Loading from "../components/loading/Loading.tsx";
// import Loading from "../components/loading/Loading.tsx";

const ProtectedRoutes = () => {
    const isLoggedIn = useIsLoggedIn();

    if (isLoggedIn === null) {
        return <>
            <Home />
            <Loading />
        </> // Show loading state while checking authentication then bg is home page
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoutes;
