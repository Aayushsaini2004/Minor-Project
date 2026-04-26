import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Calendar, Clock, User, Video, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function DoctorAppointments() {
  const { user } = useAuth()
  const [todayAppointments, setTodayAppointments] = useState([])
  const [allAppointments, setAllAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [activeTab, setActiveTab] = useState('today')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const [todayRes, allRes] = await Promise.all([
        api.get('/api/appointments/today'),
        api.get('/api/appointments/doctor/all')
      ])
      setTodayAppointments(todayRes.data)
      setAllAppointments(allRes.data)
    } catch (err) {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async () => {
    setToggling(true)
    try {
      const res = await api.post('/api/appointments/toggle-availability')
      setAvailable(res.data.availableToday)
    } catch (err) {
      // silent
    } finally {
      setToggling(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'from-green-500 to-emerald-600'
      case 'PENDING': return 'from-yellow-500 to-amber-600'
      case 'COMPLETED': return 'from-blue-500 to-indigo-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      case 'COMPLETED': return <Calendar className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const renderAppointmentCard = (apt, index) => (
    <div
      key={apt.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
            {(apt.patientName || 'P')[0]?.toUpperCase() || 'P'}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-800 mb-1">{apt.patientName}</p>
            <p className="text-sm text-gray-500 mb-2">@{apt.patientUsername}</p>
            {apt.scheduledTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">
                  {new Date(apt.scheduledTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right space-y-3">
          <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(apt.status)} shadow-md`}>
            {getStatusIcon(apt.status)}
            {apt.status}
          </span>
          <div className="flex items-center justify-end gap-1 text-green-600 font-bold">
            <DollarSign className="w-4 h-4" />
            <span>₹{apt.fee}</span>
          </div>
          {apt.meetLink && apt.status === 'CONFIRMED' && (
            <a
              href={apt.meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Video className="w-4 h-4" /> Join Call
            </a>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Calendar className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">My Appointments</h1>
              <p className="text-white/90">Manage your consultation appointments</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <span className="text-sm text-white font-semibold">Available Today</span>
            <button
              onClick={toggleAvailability}
              disabled={toggling}
              className={`relative inline-flex w-14 h-7 rounded-full transition-all duration-300 focus:outline-none shadow-lg ${
                available ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block w-6 h-6 bg-white rounded-full shadow-xl transform transition-all duration-300 mt-0.5 ${
                  available ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${available ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {available ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-1">{todayAppointments.length}</p>
              <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-green-600 mb-1">
                {allAppointments.filter(a => a.status === 'CONFIRMED').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Confirmed</p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-yellow-600 mb-1">
                {allAppointments.filter(a => a.paymentStatus === 'PENDING').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Awaiting Payment</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 rounded-xl p-1.5 w-fit animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <button
          onClick={() => setActiveTab('today')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'today' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
        >
          Today ({todayAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}
        >
          All Appointments ({allAppointments.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'today' && (
        <div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">No appointments scheduled for today</p>
              {!available && (
                <p className="text-sm text-yellow-600 mt-3 font-medium">Turn on "Available Today" so patients can book you</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((apt, index) => renderAppointmentCard(apt, index))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div>
          {allAppointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-semibold">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allAppointments.map((apt, index) => renderAppointmentCard(apt, index))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
