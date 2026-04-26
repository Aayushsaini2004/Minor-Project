import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Heart, Activity, Thermometer, Droplets, Weight, Plus, ClipboardList } from 'lucide-react'

function HealthRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    notes: ''
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await api.get('/api/health/history')
      setRecords(response.data)
    } catch (err) {
      setError('Failed to fetch health records')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/health/record', {
        ...formData,
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
        bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null
      })
      setFormData({
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        bloodSugar: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        notes: ''
      })
      fetchRecords()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Heart className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Health Records</h1>
              <p className="text-white/90">Track and monitor your health metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Record Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Record</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-1" />
                  BP Systolic
                </label>
                <input 
                  type="number" 
                  name="bloodPressureSystolic" 
                  value={formData.bloodPressureSystolic} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="120" 
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BP Diastolic
                </label>
                <input 
                  type="number" 
                  name="bloodPressureDiastolic" 
                  value={formData.bloodPressureDiastolic} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="80" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Blood Sugar
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="bloodSugar" 
                  value={formData.bloodSugar} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="mg/dL" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-1" />
                  Heart Rate
                </label>
                <input 
                  type="number" 
                  name="heartRate" 
                  value={formData.heartRate} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="bpm" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Thermometer className="w-4 h-4 inline mr-1" />
                  Temperature
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="temperature" 
                  value={formData.temperature} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="°C" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-1" />
                  Oxygen %
                </label>
                <input 
                  type="number" 
                  name="oxygenSaturation" 
                  value={formData.oxygenSaturation} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="%" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Weight
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="kg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                  placeholder="cm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClipboardList className="w-4 h-4 inline mr-1" />
                Notes
              </label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" 
                rows="3" 
                placeholder="Any additional notes..." 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Save Record
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Recent Records</h2>
          </div>
          
          {records.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No records found</p>
              <p className="text-gray-400 text-sm mt-2">Start tracking your health today!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {records.map((record, index) => (
                <div 
                  key={record.id} 
                  className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(record.recordedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {record.bloodPressureSystolic && (
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <span className="text-gray-500 text-xs">BP</span>
                        <p className="font-semibold text-gray-800">
                          {record.bloodPressureSystolic}/{record.bloodPressureDiastolic}
                        </p>
                      </div>
                    )}
                    {record.heartRate && (
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <span className="text-gray-500 text-xs">Heart Rate</span>
                        <p className="font-semibold text-gray-800">{record.heartRate} bpm</p>
                      </div>
                    )}
                    {record.bloodSugar && (
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <span className="text-gray-500 text-xs">Blood Sugar</span>
                        <p className="font-semibold text-gray-800">{record.bloodSugar} mg/dL</p>
                      </div>
                    )}
                    {record.temperature && (
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <span className="text-gray-500 text-xs">Temperature</span>
                        <p className="font-semibold text-gray-800">{record.temperature}°C</p>
                      </div>
                    )}
                  </div>
                  {record.notes && (
                    <p className="text-xs text-gray-600 mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      📝 {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HealthRecords
