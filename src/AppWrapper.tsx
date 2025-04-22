import { useState } from "react";
import Context from "./contexts/Context.ts";

import App from "./App.jsx";

const AppWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<object | null>(null);

    return (
        <Context.Provider
            value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
        >
            <App />
        </Context.Provider>
    );
};

export default AppWrapper;
