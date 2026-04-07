import useAuthStore from "@/store/useAuthstore"
import { Button } from "./ui/button"
import { Bell, Menu } from "lucide-react"

interface HeaderProps {
  onMenuClick?: () => void
}

function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore()
  return (
    <header className="sticky top-0 z-10 flex items-center h-16 gap-3 sm:gap-5 bg-background border-b border-border px-3 sm:px-4">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </Button>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Button
          variant="ghost" size="icon"
          className="rounded-full"
        >
          <Bell size={18} />
        </Button>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:block">
          <div className="text-sm font-medium truncate max-w-[120px] md:max-w-none">{user?.name}</div>
          <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
        </div>
        <div
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold overflow-hidden flex-shrink-0"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}</div>
      </div>
    </header>
  )
}

export default Header
