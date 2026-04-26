import { useState, useEffect } from 'react'
import { Search, User, Mail, Phone, Calendar, Activity, Eye, FileText, Users } from 'lucide-react'
import api from '../../services/api'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await api.get('/api/doctor/patients')
      setPatients(response.data)
    } catch (err) {
      setError('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Patients</h1>
              <p className="text-white/90">Manage and view all your patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Found {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {filteredPatients.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No patients found</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-blue-50 transition-all duration-300 bg-white animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                            {patient.fullName?.charAt(0).toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900">{patient.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">@{patient.username || 'user'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{patient.email || 'N/A'}</div>
                        {patient.phoneNumber && (
                          <div className="text-xs text-gray-500 mt-1">{patient.phoneNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {patient.age || '-'} years
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {patient.gender || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105">
                            <FileText className="w-4 h-4" />
                            Records
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="md:hidden space-y-4">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Patient Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                      {patient.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{patient.fullName || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">@{patient.username || 'user'}</p>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900 truncate font-medium">{patient.email || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    {patient.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900 font-medium">{patient.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    {/* Age & Gender */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p className="text-sm font-bold text-gray-900">{patient.age || '-'} years</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Gender</p>
                          <p className="text-sm font-bold text-gray-900 capitalize">{patient.gender || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:shadow-md">
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 hover:shadow-md">
                      <FileText className="w-4 h-4" />
                      View Records
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Results Count */}
        {filteredPatients.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center font-medium">
              Showing {filteredPatients.length} of {patients.length} patient{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Patients
