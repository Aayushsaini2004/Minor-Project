import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { UserPlus, ArrowLeft, User, Mail, Lock, Phone, Calendar, Briefcase, DollarSign, Upload } from 'lucide-react'

const RegisterDoctor = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    specialization: '',
    experienceYears: '',
    consultationFee: '',
    availableToday: false,
    qrCodeUrl: '',
    role: 'DOCTOR'
  })
  const [qrCodeFile, setQrCodeFile] = useState(null)
  const [qrPreview, setQrPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Only ADMIN can access this page
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600">
        <div className="text-center bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/90 text-lg">Only Admin can register doctors.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'qrCodeUrl') {
          submitData.append(key, formData[key])
        }
      })
      
      // Append QR code file if selected
      if (qrCodeFile) {
        submitData.append('qrCodeFile', qrCodeFile)
      }

      const response = await api.post('/api/auth/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setMessage({ type: 'success', text: 'Doctor registered successfully!' })
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        age: '',
        gender: '',
        specialization: '',
        experienceYears: '',
        consultationFee: '',
        availableToday: false,
        qrCodeUrl: '',
        role: 'DOCTOR'
      })
      setQrCodeFile(null)
      setQrPreview(null)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to register doctor' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 animate-pulse-glow">
                <UserPlus className="w-12 h-12" />
              </div>
              <h1 className="text-4xl font-bold mb-2 animate-fade-in-down">Register Doctor</h1>
              <p className="text-white/90 text-lg">Create a new doctor account</p>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl border-2 animate-fade-in ${
                message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <p className="font-semibold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* Username */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password *
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Age
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Specialization *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="e.g. Cardiologist, Dermatologist"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>

              {/* Experience & Fee */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g. 10 years"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g. 500"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  />
                </div>
              </div>

              {/* QR Code Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Payment QR Code Image
                </label>
                <div className="border-3 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group">
                  <input
                    type="file"
                    id="qrCodeFile"
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
                  <label htmlFor="qrCodeFile" className="cursor-pointer block">
                    {!qrPreview ? (
                      <div>
                        <Upload className="mx-auto h-16 w-16 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                        <p className="mt-3 text-base text-gray-700 font-semibold">
                          Click to upload QR code image
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <img 
                          src={qrPreview} 
                          alt="QR Preview" 
                          className="mx-auto max-w-xs h-auto border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        />
                        <p className="mt-3 text-base text-green-600 font-bold">✓ Image selected</p>
                        <p className="mt-1 text-sm text-gray-500">Click above to change</p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-3">Upload the payment QR code image directly from your device</p>
              </div>

              {/* Available Today */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <input
                  type="checkbox"
                  id="availableToday"
                  checked={formData.availableToday}
                  onChange={(e) => setFormData({ ...formData, availableToday: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="availableToday" className="text-base text-gray-700 font-semibold">Available Today</label>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  value="DOCTOR"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-2">Only Admin can register doctors</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register Doctor
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterDoctor
