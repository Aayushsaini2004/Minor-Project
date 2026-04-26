import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  Stethoscope,
  HeartPulse,
  FileText,
  Image,
  Users,
  ClipboardList,
  Activity,
  UserPlus,
  Video,
  CalendarCheck,
  QrCode,
  Sparkles,
  Pill,
  Bell,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const isDoctor = user?.role === 'DOCTOR'
  const isAdmin = user?.role === 'ADMIN'
  const isPatient = user?.role === 'USER'
  const [expandedSections, setExpandedSections] = useState({})

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/symptom-checker', icon: Stethoscope, label: 'Symptom Checker' },
    { to: '/health-records', icon: HeartPulse, label: 'My Health Records' },
    { to: '/medical-reports', icon: FileText, label: 'My Medical Reports' },
    { to: '/image-diagnosis', icon: Image, label: 'Image Diagnosis' },
    { to: '/generic-medicine-finder', icon: Pill, label: 'Generic Medicine Finder' },
    { to: '/drug-interaction-checker', icon: Pill, label: 'Drug Interaction Checker' },
    { to: '/medicine-reminder', icon: Bell, label: 'Medicine Reminder' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/consult-doctor', icon: Video, label: 'Consult Doctor' },
    { to: '/ai-avatar-doctor', icon: Sparkles, label: 'AI Avatar Doctor' },

  ]

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: Activity, label: 'Doctor Dashboard' },
    { to: '/doctor/patients', icon: Users, label: 'Patients' },
    { to: '/doctor/appointments', icon: CalendarCheck, label: 'Appointments' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/doctor/health-records', icon: HeartPulse, label: 'Health Records' },
    { to: '/doctor/medical-reports', icon: FileText, label: 'Medical Reports' },
    { to: '/doctor/triage', icon: ClipboardList, label: 'Triage' },
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  const SidebarContent = () => (
    <>
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <nav className="p-3 sm:p-4 space-y-2 sm:space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-4rem)]">
        {isPatient && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('patient')}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 mb-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Patient
              </h3>
              {expandedSections.patient !== false ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {(expandedSections.patient !== false) && (
              <div className="space-y-1">
                {userLinks.map((link) => (
                  <NavLink 
                    key={link.to} 
                    to={link.to} 
                    className={linkClass}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {isDoctor && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('doctor')}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 mb-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Doctor
              </h3>
              {expandedSections.doctor !== false ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {(expandedSections.doctor !== false) && (
              <div className="space-y-1">
                {doctorLinks.map((link) => (
                  <NavLink 
                    key={link.to} 
                    to={link.to} 
                    className={linkClass}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('admin')}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 mb-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </h3>
              {expandedSections.admin !== false ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {(expandedSections.admin !== false) && (
              <div className="space-y-1">
                <NavLink 
                  to="/admin/register-doctor" 
                  className={linkClass}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Register Doctor</span>
                </NavLink>
                <NavLink 
                  to="/admin/manage-qr" 
                  className={linkClass}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Manage Payment QR</span>
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Always Visible */}
      <aside className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity"
            onClick={onClose}
          />
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 w-64 sm:w-72 h-full bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}

export default Sidebar
