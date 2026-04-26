  import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { QrCode, ArrowLeft, Edit2, CheckCircle, Upload, X } from 'lucide-react'

const ManageDoctorQR = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const [qrCodeFile, setQrCodeFile] = useState(null)
  const [qrPreview, setQrPreview] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Only ADMIN can access this page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600">
        <div className="text-center bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/90 text-lg">Only Admin can manage QR codes.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/appointments/doctors')
      setDoctors(res.data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch doctors' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor)
    setQrUrl(doctor.qrCodeUrl || '')
    setQrCodeFile(null)
    setQrPreview(null)
    setShowModal(true)
  }

  const handleSaveQR = async () => {
    try {
      if (qrCodeFile) {
        // Upload file
        const formData = new FormData()
        formData.append('qrCodeFile', qrCodeFile)
        
        await api.post(`/api/appointments/${selectedDoctor.id}/qr-code/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else if (qrUrl) {
        // Update URL
        await api.put(`/api/appointments/${selectedDoctor.id}/qr-code`, {
          qrCodeUrl: qrUrl
        })
      }
      
      setMessage({ type: 'success', text: 'QR code updated successfully!' })
      setShowModal(false)
      fetchDoctors()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update QR code' })
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
        </div>

        {/* Page Header Card */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
                <QrCode className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold animate-fade-in-down">Manage Doctor Payment QR Codes</h1>
                <p className="text-white/90 text-lg">Update payment QR codes for registered doctors</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border-2 animate-fade-in ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <QrCode className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No doctors registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {(doctor.fullName || 'D')[0]?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{doctor.fullName}</h3>
                      <p className="text-purple-600 font-semibold">{doctor.specialization}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(doctor)}
                    className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-110"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Fee:</span>
                    <span className="font-bold text-green-600 text-lg">₹{doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Available:</span>
                    <span className={`font-bold text-lg ${doctor.availableToday ? 'text-green-600' : 'text-gray-400'}`}>
                      {doctor.availableToday ? 'Yes ✓' : 'No ✗'}
                    </span>
                  </div>
                </div>

                {doctor.qrCodeUrl ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm mb-3 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      QR Code Set
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                      <img 
                        src={doctor.qrCodeUrl} 
                        alt="Payment QR" 
                        className="w-32 h-32 mx-auto rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-orange-600 text-sm font-semibold">
                      <QrCode className="w-5 h-5" />
                      No QR Code Set
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to edit QR */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white rounded-t-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold pr-10">
                Update QR Code
              </h3>
              <p className="text-white/90 text-sm mt-1">{selectedDoctor.fullName}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload QR Code Image
                </label>
                <div className="border-3 border-dashed border-purple-300 rounded-2xl p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group">
                  <input
                    type="file"
                    id="qrCodeFileModal"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setQrCodeFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setQrPreview(reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="qrCodeFileModal" className="cursor-pointer block">
                    {!qrPreview ? (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                        <p className="mt-2 text-sm text-gray-700 font-semibold">
                          Click to upload new QR code
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <img 
                          src={qrPreview} 
                          alt="QR Preview" 
                          className="mx-auto max-w-xs h-auto border-2 border-purple-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        />
                        <p className="mt-3 text-sm text-green-600 font-bold">✓ New image selected</p>
                        <p className="mt-1 text-xs text-gray-500">Click above to change</p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-3">Upload a new QR code image to replace the existing one</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQR}
                  disabled={!qrCodeFile && !qrUrl}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                  Save QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageDoctorQR
