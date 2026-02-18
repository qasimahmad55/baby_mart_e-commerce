import { Navigate, Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { toast, Toaster } from "sonner";
import useAuthStore from "./store/useAuthstore";
import { useState } from "react";
import { cn } from "./lib/utils";
// import { Button } from "./components/ui/button";

function App() {

  const { isAuthenticated } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={cn("flex flex-col flex-1 max-w-[--breakpoint-2xl]", sidebarOpen ? "md:ml-64" : "md:ml-20")}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div >
  );
}

export default App;
