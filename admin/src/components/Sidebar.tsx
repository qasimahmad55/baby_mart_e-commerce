import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from './ui/button'
import { Bookmark, ChevronLeft, ChevronRight, FileText, Layers, LayoutDashboard, LogOut, Package, ShoppingBag, Tag, User, Users, X } from 'lucide-react'
import useAuthStore from '@/store/useAuthstore'
import type React from 'react'
import { NavLink, useLocation } from 'react-router'



type sidebarProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  mobileOpen: boolean,
  setMobileOpen: (open: boolean) => void
}

type navItemProps = {
  to: string,
  icon: React.ReactNode,
  label: string,
  open: boolean,
  end?: boolean,
  pathName: string,
  onClick?: () => void
}

const navigationItems = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/dashboard/account",
    icon: <User size={20} />,
    label: "Account",
  },
  {
    to: "/dashboard/users",
    icon: <Users size={20} />,
    label: "Users",
  },
  {
    to: "/dashboard/orders",
    icon: <Package size={20} />,
    label: "Orders",
  },
  {
    to: "/dashboard/invoices",
    icon: <FileText size={20} />,
    label: "Invoices",
  },
  {
    to: "/dashboard/banners",
    icon: <Layers size={20} />,
    label: "Banners",
  },
  {
    to: "/dashboard/products",
    icon: <ShoppingBag size={20} />,
    label: "Products",
  },
  {
    to: "/dashboard/categories",
    icon: <Tag size={20} />,
    label: "Categories",
  },
  {
    to: "/dashboard/brands",
    icon: <Bookmark size={20} />,
    label: "Brands",
  },
];

function Sidebar({ open, setOpen, mobileOpen, setMobileOpen }: sidebarProps) {
  const { user, logout } = useAuthStore()
  const { pathname } = useLocation()

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: open ? 256 : 80 }}
        animate={{ width: open ? 256 : 80 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden md:flex flex-col border-r border-slate-700/50 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 shadow-2xl transition-all duration-300 backdrop-blur-xl",
          open ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 bg-gradient-to-r from-[#29beb3]/80 via-slate-700/50 to-[#a96bde]/80 border-b border-slate-600/50 backdrop-blur-xl shadow-lg shadow-[#29beb3]/10">
          <motion.div
            className={cn(
              "flex items-center overflow-hidden",
              open ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
            initial={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
            animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <span className='font-bold text-xl text-white drop-shadow-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent'>BabyShop Admin</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="rounded-full bg-white/15 hover:bg-white/25 text-white/90 hover:text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.div
                animate={{ rotate: open ? 0 : 180 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {open ? (<ChevronLeft size={20} />)
                  : (<ChevronRight size={20} className='rotate-180' />)}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Sidebar menu */}
        <div className='flex flex-col gap-1 flex-1 p-3 bg-gradient-to-b text-white from-slate-900/30 to-slate-800/30 overflow-y-auto backdrop-blur-sm hide-scrollbar'>
          {navigationItems?.map((item, index) => (
            <motion.div
              key={item?.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            >
              <NavItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                open={open}
                end={item.end}
                pathName={pathname}
              />
            </motion.div>
          ))}
        </div>
        {/* Logout Button */}
        <div className="p-4 border-t border-slate-600/50 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 backdrop-blur-xl shadow-lg shadow-slate-900/50">
          <motion.div
            className={cn(
              "flex items-center gap-3 mb-4",
              open ? "justify-start" : "justify-center"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#29beb3] to-[#a96bde] flex items-center justify-center text-white font-semibold overflow-hidden shadow-lg ring-2 ring-white/20 flex-shrink-0 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {user?.avatar ? (
                <img src={user?.avatar} alt="UserImage" className="h-full w-full object-cover" />
              ) : (user?.name?.charAt(0).toUpperCase())}
            </motion.div>
            <AnimatePresence>
              {open && (
                <motion.div
                  className="flex flex-col min-w-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">{user?.name}</span>
                  <span className="text-xs text-[#29beb3] capitalize font-medium bg-slate-700/70 px-2 py-1 rounded-full backdrop-blur-md shadow-sm">{user?.role}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button variant={"outline"} size={open ? "default" : "icon"}
              className="w-full border-red-500/40 hover:bg-red-600/30 hover:border-red-400/70 text-red-300 hover:text-red-100 transition-all duration-300 bg-red-600/15 backdrop-blur-md hover:shadow-lg hover:shadow-red-500/20 shadow-md"
              onClick={logout}
            >
              <LogOut
                size={16} className={cn("mr-2 transition-transform duration-300 hover:scale-110", !open && "mr-0")}
              />
              {open && "Logout"}
            </Button>
          </motion.div>
        </div>

      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", type: "spring", bounce: 0.25 }}
            className="fixed inset-y-0 left-0 z-30 w-[280px] flex md:hidden flex-col border-r border-slate-700/50 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-4 h-16 bg-gradient-to-r from-[#29beb3]/80 via-slate-700/50 to-[#a96bde]/80 border-b border-slate-600/50 backdrop-blur-xl shadow-lg shadow-[#29beb3]/10">
              <span className='font-bold text-xl text-white drop-shadow-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent'>BabyShop Admin</span>
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-white/15 hover:bg-white/25 text-white/90 hover:text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Sidebar menu */}
            <div className='flex flex-col gap-1 flex-1 p-3 bg-gradient-to-b text-white from-slate-900/30 to-slate-800/30 overflow-y-auto backdrop-blur-sm hide-scrollbar'>
              {navigationItems?.map((item, index) => (
                <motion.div
                  key={item?.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                >
                  <NavItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    open={true}
                    end={item.end}
                    pathName={pathname}
                    onClick={handleNavClick}
                  />
                </motion.div>
              ))}
            </div>

            {/* Mobile Logout Button */}
            <div className="p-4 border-t border-slate-600/50 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 backdrop-blur-xl shadow-lg shadow-slate-900/50">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-[#29beb3] to-[#a96bde] flex items-center justify-center text-white font-semibold overflow-hidden shadow-lg ring-2 ring-white/20 flex-shrink-0 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {user?.avatar ? (
                    <img src={user?.avatar} alt="UserImage" className="h-full w-full object-cover" />
                  ) : (user?.name?.charAt(0).toUpperCase())}
                </motion.div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-white truncate">{user?.name}</span>
                  <span className="text-xs text-[#29beb3] capitalize font-medium bg-slate-700/70 px-2 py-1 rounded-full backdrop-blur-md shadow-sm w-fit">{user?.role}</span>
                </div>
              </div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  variant={"outline"}
                  className="w-full border-red-500/40 hover:bg-red-600/30 hover:border-red-400/70 text-red-300 hover:text-red-100 transition-all duration-300 bg-red-600/15 backdrop-blur-md hover:shadow-lg hover:shadow-red-500/20 shadow-md"
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-2 transition-transform duration-300 hover:scale-110" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function NavItem({ to, icon, label, open, end, pathName, onClick }: (navItemProps)) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center p-3 rounded-xl text-sm font-medium hoverEffect gap-3 overflow-hidden text-white/80 transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-[#29beb3]/25 to-[#a96bde]/25 text-white shadow-lg shadow-[#29beb3]/30 ring-1 ring-[#29beb3]/40 border border-white/15 backdrop-blur-md"
          : "hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/40 hover:text-white/95 hover:shadow-md hover:backdrop-blur-md text-slate-300"
      )}
    >
      <motion.span
        className="flex-shrink-0"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.span>
      {open && (
        <motion.span
          className="truncate flex-1"
          initial={{ opacity: 0, x: -5, width: 0 }}
          animate={{ opacity: 1, x: 0, width: "auto" }}
          exit={{ opacity: 0, x: -5, width: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
        </motion.span>
      )}
    </NavLink>
  )
}

export default Sidebar