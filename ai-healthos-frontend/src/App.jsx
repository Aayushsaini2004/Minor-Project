import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import LandingPage from './pages/Landing/LandingPage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import SymptomChecker from './pages/Diagnosis/SymptomChecker'
import HealthRecords from './pages/Health/HealthRecords'
import GenericMedicineFinder from './pages/Health/GenericMedicineFinder'
import DrugInteractionChecker from './pages/Health/DrugInteractionChecker'
import MedicineReminder from './pages/Health/MedicineReminder'
import MedicalReports from './pages/Reports/MedicalReports'
import ImageDiagnosis from './pages/Diagnosis/ImageDiagnosis'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import Patients from './pages/Doctor/Patients'
import Triage from './pages/Doctor/Triage'
import DoctorHealthRecords from './pages/Doctor/DoctorHealthRecords'
import DoctorMedicalReports from './pages/Doctor/DoctorMedicalReports'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import RegisterDoctor from './pages/Admin/RegisterDoctor'
import ManageDoctorQR from './pages/Admin/ManageDoctorQR'
import ConsultDoctor from './pages/Consultation/ConsultDoctor'
import AIAvatarDoctor from './pages/Diagnosis/AIAvatarDoctor'
import ChatPage from './pages/Chat/ChatPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {user && <Navbar onMenuToggle={toggleSidebar} />}
      <div className="flex">
        {user && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
        <main className={`flex-1 transition-all duration-300 ${
          user ? 'lg:ml-64 mt-14 sm:mt-16' : ''
        }`}>
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1920px] mx-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - All Users */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
            <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
            <Route path="/medical-reports" element={<ProtectedRoute><MedicalReports /></ProtectedRoute>} />
            <Route path="/image-diagnosis" element={<ProtectedRoute><ImageDiagnosis /></ProtectedRoute>} />
            <Route path="/generic-medicine-finder" element={<ProtectedRoute><GenericMedicineFinder /></ProtectedRoute>} />
            <Route path="/drug-interaction-checker" element={<ProtectedRoute><DrugInteractionChecker /></ProtectedRoute>} />
            <Route path="/medicine-reminder" element={<ProtectedRoute><MedicineReminder /></ProtectedRoute>} />
            <Route path="/consult-doctor" element={<ProtectedRoute><ConsultDoctor /></ProtectedRoute>} />
            <Route path="/ai-avatar-doctor" element={<ProtectedRoute><AIAvatarDoctor /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><Patients /></ProtectedRoute>} />
            <Route path="/doctor/health-records" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorHealthRecords /></ProtectedRoute>} />
            <Route path="/doctor/medical-reports" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorMedicalReports /></ProtectedRoute>} />
            <Route path="/doctor/triage" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><Triage /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><DoctorAppointments /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/register-doctor" element={<ProtectedRoute allowedRoles={['ADMIN']}><RegisterDoctor /></ProtectedRoute>} />
            <Route path="/admin/manage-qr" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageDoctorQR /></ProtectedRoute>} />
          </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
