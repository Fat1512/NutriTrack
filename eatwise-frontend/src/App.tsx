import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import { SidebarProvider } from "./context/SidebarContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RoutinePage from "./page/RoutinePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<div> HOME PAGE </div>} />
              <Route path="/" element={<div> HOME PAGE </div>} />
              <Route path="/routine" element={<RoutinePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
