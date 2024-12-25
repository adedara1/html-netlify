import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainSidebar from "@/components/MainSidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductPage from "@/pages/ProductPage";
import Blog from "@/pages/Blog";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Routes that should not display the sidebar
const noSidebarRoutes = ['/product'];

const AppContent = () => {
  const location = useLocation();
  const shouldShowSidebar = !noSidebarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden">
      {shouldShowSidebar && <MainSidebar />}
      <main className={`flex-1 w-full overflow-y-auto p-4 md:p-8 ${shouldShowSidebar ? 'md:w-[calc(100%-16rem)]' : 'md:w-full'}`}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;