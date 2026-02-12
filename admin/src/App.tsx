import { Navigate, Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { toast, Toaster } from "sonner";
import useAuthStore from "./store/useAuthstore";
// import { Button } from "./components/ui/button";

function App() {

  const { isAuthenticated } = useAuthStore()
  // console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 max-w-[--breakpoint-2xl] ml-64">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
