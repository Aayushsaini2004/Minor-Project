import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Users, AlertTriangle, Activity, FileText, ArrowRight, Stethoscope, Heart, Shield } from 'lucide-react'

function DoctorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/doctor/stats')
      setStats(response.data)
    } catch (err) {
      setError('Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Stethoscope className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Doctor Dashboard</h1>
              <p className="text-white/90">Monitor patients and manage consultations</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-l-4 border-blue-500 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Total Patients</p>
                <p className="text-4xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-l-4 border-red-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Active Emergencies</p>
                <p className="text-4xl font-bold text-red-600">{stats.activeEmergencies}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-l-4 border-orange-500 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">High Risk Cases</p>
                <p className="text-4xl font-bold text-orange-600">{stats.unreviewedHighRiskDiagnoses}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-xl">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-l-4 border-purple-500 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Abnormal Reports</p>
                <p className="text-4xl font-bold text-purple-600">{stats.unreviewedAbnormalReports}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="space-y-4">
            <a href="/doctor/patients" className="group block p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200 hover:shadow-lg transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-800 text-lg mb-1">View All Patients</p>
                  <p className="text-sm text-blue-600">Manage patient records and history</p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </a>
            <a href="/doctor/triage" className="group block p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-all duration-300 border border-red-200 hover:shadow-lg transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-800 text-lg mb-1">Patient Triage</p>
                  <p className="text-sm text-red-600">Review high-risk cases and emergencies</p>
                </div>
                <ArrowRight className="w-6 h-6 text-red-600 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </a>
            <a href="/doctor/health-records" className="group block p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 hover:to-teal-100 transition-all duration-300 border border-green-200 hover:shadow-lg transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-green-800 text-lg mb-1">Health Records</p>
                  <p className="text-sm text-green-600">View patient vital signs and metrics</p>
                </div>
                <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </a>
            <a href="/doctor/medical-reports" className="group block p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-200 hover:shadow-lg transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-purple-800 text-lg mb-1">Medical Reports</p>
                  <p className="text-sm text-purple-600">Review lab reports and analysis</p>
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">System Status</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-semibold text-gray-800">AI Diagnosis Service</span>
              </div>
              <span className="text-green-600 font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-semibold text-gray-800">OCR Service</span>
              </div>
              <span className="text-green-600 font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-semibold text-gray-800">Emergency Detection</span>
              </div>
              <span className="text-green-600 font-bold">Online</span>
            </div>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">💡 Quick Tip</h3>
            <p className="text-sm text-blue-700">Check the triage page regularly to review high-risk patients and emergencies promptly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
