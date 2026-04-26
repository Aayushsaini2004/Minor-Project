import { useState, useEffect } from 'react'
import api from '../../services/api'
import { HeartPulse, User, Calendar, Search, AlertCircle, Activity, Droplets, Thermometer, Wind, Weight } from 'lucide-react'

function DoctorHealthRecords() {
  const [records, setRecords] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAllRecords()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(records)
    } else {
      setFiltered(records.filter(r =>
        r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.patientUsername?.toLowerCase().includes(search.toLowerCase())
      ))
    }
  }, [search, records])

  const fetchAllRecords = async () => {
    try {
      const response = await api.get('/api/health/all-patients')
      setRecords(response.data)
      setFiltered(response.data)
    } catch (err) {
      setError('Failed to fetch health records')
    } finally {
      setLoading(false)
    }
  }

  const getRiskConfig = (record) => {
    const bp = record.bloodPressureSystolic
    const sugar = record.bloodSugar
    const hr = record.heartRate
    if ((bp && bp > 140) || (sugar && sugar > 200) || (hr && hr > 100)) {
      return { label: 'High Risk', bg: 'from-red-500 to-rose-600', text: 'text-red-600', bgLight: 'bg-red-50' }
    }
    if ((bp && bp > 120) || (sugar && sugar > 140)) {
      return { label: 'Moderate', bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-600', bgLight: 'bg-yellow-50' }
    }
    return { label: 'Normal', bg: 'from-green-500 to-emerald-600', text: 'text-green-600', bgLight: 'bg-green-50' }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <HeartPulse className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Patients Health Records</h1>
              <p className="text-white/90">View health vitals submitted by all patients</p>
            </div>
          </div>
          <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-lg border border-white/30">
            {records.length} Records
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
          <HeartPulse className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold">No health records found</p>
          <p className="text-gray-400 text-sm mt-2">Records will appear here once patients submit their vitals</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((record, index) => {
            const riskConfig = getRiskConfig(record)
            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Patient Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{record.patientName || record.patientUsername}</p>
                      <p className="text-sm text-gray-500">@{record.patientUsername}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${riskConfig.bg} text-white shadow-md`}>
                      {riskConfig.label}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {record.recordedAt ? new Date(record.recordedAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {record.bloodPressureSystolic && (
                    <div className={`rounded-xl p-4 ${record.bloodPressureSystolic > 140 ? 'bg-red-50 border-2 border-red-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`w-5 h-5 ${record.bloodPressureSystolic > 140 ? 'text-red-600' : 'text-blue-600'}`} />
                        <p className="text-xs text-gray-500 font-medium">Blood Pressure</p>
                      </div>
                      <p className={`text-xl font-bold ${record.bloodPressureSystolic > 140 ? 'text-red-600' : 'text-gray-800'}`}>
                        {record.bloodPressureSystolic}/{record.bloodPressureDiastolic}
                      </p>
                      <p className="text-xs text-gray-400">mmHg</p>
                    </div>
                  )}
                  {record.bloodSugar && (
                    <div className={`rounded-xl p-4 ${record.bloodSugar > 200 ? 'bg-red-50 border-2 border-red-200' : record.bloodSugar > 140 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className={`w-5 h-5 ${record.bloodSugar > 140 ? 'text-yellow-600' : 'text-purple-600'}`} />
                        <p className="text-xs text-gray-500 font-medium">Blood Sugar</p>
                      </div>
                      <p className={`text-xl font-bold ${record.bloodSugar > 200 ? 'text-red-600' : record.bloodSugar > 140 ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {record.bloodSugar}
                      </p>
                      <p className="text-xs text-gray-400">mg/dL</p>
                    </div>
                  )}
                  {record.heartRate && (
                    <div className={`rounded-xl p-4 ${record.heartRate > 100 ? 'bg-red-50 border-2 border-red-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <HeartPulse className={`w-5 h-5 ${record.heartRate > 100 ? 'text-red-600' : 'text-red-600'}`} />
                        <p className="text-xs text-gray-500 font-medium">Heart Rate</p>
                      </div>
                      <p className={`text-xl font-bold ${record.heartRate > 100 ? 'text-red-600' : 'text-gray-800'}`}>
                        {record.heartRate}
                      </p>
                      <p className="text-xs text-gray-400">bpm</p>
                    </div>
                  )}
                  {record.temperature && (
                    <div className={`rounded-xl p-4 ${record.temperature > 38 ? 'bg-red-50 border-2 border-red-200' : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className={`w-5 h-5 ${record.temperature > 38 ? 'text-red-600' : 'text-orange-600'}`} />
                        <p className="text-xs text-gray-500 font-medium">Temperature</p>
                      </div>
                      <p className={`text-xl font-bold ${record.temperature > 38 ? 'text-red-600' : 'text-gray-800'}`}>
                        {record.temperature}
                      </p>
                      <p className="text-xs text-gray-400">°C</p>
                    </div>
                  )}
                  {record.oxygenSaturation && (
                    <div className={`rounded-xl p-4 ${record.oxygenSaturation < 95 ? 'bg-red-50 border-2 border-red-200' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className={`w-5 h-5 ${record.oxygenSaturation < 95 ? 'text-red-600' : 'text-cyan-600'}`} />
                        <p className="text-xs text-gray-500 font-medium">SpO2</p>
                      </div>
                      <p className={`text-xl font-bold ${record.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-800'}`}>
                        {record.oxygenSaturation}%
                      </p>
                      <p className="text-xs text-gray-400">Oxygen</p>
                    </div>
                  )}
                  {record.weight && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Weight className="w-5 h-5 text-green-600" />
                        <p className="text-xs text-gray-500 font-medium">Weight</p>
                      </div>
                      <p className="text-xl font-bold text-gray-800">{record.weight}</p>
                      <p className="text-xs text-gray-400">kg</p>
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">Patient Notes</p>
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DoctorHealthRecords
