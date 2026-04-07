import { Navigate, Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import {  Toaster } from "sonner";
import useAuthStore from "./store/useAuthstore";
import { useState } from "react";
import { cn } from "./lib/utils";
// import { Button } from "./components/ui/button";

function App() {

  const { isAuthenticated } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  // console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className={cn("flex flex-col flex-1 max-w-[--breakpoint-2xl] w-full", sidebarOpen ? "md:ml-64" : "md:ml-20")}>
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div >
  );
}

export default App;
