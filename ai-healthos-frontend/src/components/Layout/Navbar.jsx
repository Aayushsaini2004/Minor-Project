import { useAuth } from '../../contexts/AuthContext'
import { Activity, LogOut, User, Menu } from 'lucide-react'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white shadow-md z-40">
      <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI HealthOS
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* User Info - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base truncate max-w-[100px] md:max-w-[150px]">
              {user?.fullName}
            </span>
            <span className="px-2 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs bg-blue-100 text-blue-700 rounded-full font-medium whitespace-nowrap">
              {user?.role}
            </span>
          </div>

          {/* Mobile User Icon */}
          <div className="sm:hidden flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
