import { useState, useEffect } from 'react'
import api from '../../services/api'
import { AlertTriangle, Clock, Activity, User, Mail, ArrowRight, Shield } from 'lucide-react'

function Triage() {
  const [triageList, setTriageList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTriageList()
  }, [])

  const fetchTriageList = async () => {
    try {
      const response = await api.get('/api/doctor/triage')
      setTriageList(response.data)
    } catch (err) {
      setError('Failed to fetch triage list')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          bg: 'from-red-500 to-rose-600',
          border: 'border-red-300',
          badge: 'bg-red-600',
          icon: '🚨'
        }
      case 'HIGH':
        return {
          bg: 'from-orange-500 to-orange-600',
          border: 'border-orange-300',
          badge: 'bg-orange-500',
          icon: '⚠️'
        }
      case 'MEDIUM':
        return {
          bg: 'from-yellow-500 to-amber-500',
          border: 'border-yellow-300',
          badge: 'bg-yellow-500',
          icon: '🔶'
        }
      default:
        return {
          bg: 'from-green-500 to-emerald-600',
          border: 'border-green-300',
          badge: 'bg-green-500',
          icon: '✅'
        }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Patient Triage</h1>
              <p className="text-white/90">Prioritize patients based on AI risk assessments</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-blue-800 mb-1">Triage Queue</p>
            <p className="text-sm text-blue-700">Review and prioritize patients based on AI-generated risk assessments and emergency alerts. Critical cases require immediate attention.</p>
          </div>
        </div>
      </div>

      {triageList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
          <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold">No patients in triage queue</p>
          <p className="text-gray-400 text-sm mt-2">All patients are stable or awaiting assessment</p>
        </div>
      ) : (
        <div className="space-y-6">
          {triageList.map((item, index) => {
            const config = getPriorityConfig(item.priority)
            return (
              <div
                key={item.patientId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Priority Header */}
                <div className={`bg-gradient-to-r ${config.bg} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{item.patientName}</h3>
                        <p className="text-white/90 flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4" />
                          {item.patientEmail}
                        </p>
                      </div>
                    </div>
                    <span className={`px-6 py-3 rounded-full text-sm font-bold bg-white text-gray-800 shadow-lg animate-pulse`}>
                      {config.icon} {item.priority} PRIORITY
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <p className="font-semibold text-gray-700">Recent Diagnosis</p>
                      </div>
                      <p className="text-gray-800 font-medium">{item.recentDiagnosis || 'None'}</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <p className="font-semibold text-gray-700">Risk Level</p>
                      </div>
                      <p className="text-gray-800 font-medium">{item.riskLevel || 'Low'}</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <p className="font-semibold text-gray-700">Last Updated</p>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {item.reason && (
                    <div className={`p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 mb-6`}>
                      <p className="font-semibold text-yellow-800 mb-2">Reason for Triage:</p>
                      <p className="text-yellow-700">{item.reason}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                      <Activity className="w-5 h-5" />
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Triage
