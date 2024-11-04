import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { ShoeProvider } from "./contexts/shoeContext";
import Home from "./pages/home/Home";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ShoeProvider>
        <Home />
      </ShoeProvider>
    </QueryClientProvider>
  );
}

export default App;
