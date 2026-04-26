import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { Video, Clock, Star, CheckCircle, Calendar, Phone, QrCode, UserPlus, Activity, X } from 'lucide-react'

function ConsultDoctor() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [pendingAppointment, setPendingAppointment] = useState(null)
  const [bookingDone, setBookingDone] = useState(false)
  const [paying, setPaying] = useState(false)
  const [myAppointments, setMyAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('doctors')
  const [showQRCode, setShowQRCode] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchDoctors()
    fetchMyAppointments()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/appointments/doctors')
      setDoctors(res.data)
    } catch (err) {
      setError('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyAppointments = async () => {
    try {
      const res = await api.get('/api/appointments/my')
      setMyAppointments(res.data)
    } catch (err) {
      // silent
    }
  }

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor)
    setShowPayModal(true)
    setBookingDone(false)
    setPendingAppointment(null)
  }

  const handleBookStep = async () => {
    try {
      const res = await api.post('/api/appointments/book', { doctorId: selectedDoctor.id })
      console.log('Booking response:', res.data)
      console.log('QR Code URL:', res.data.qrCodeUrl)
      
      // Ensure QR code URL is absolute and uses /uploads/ path instead of /api/files/
      let qrCodeUrl = res.data.qrCodeUrl
      if (qrCodeUrl && qrCodeUrl.startsWith('/api/files/')) {
        // Convert /api/files/qr-codes/xxx.png to /uploads/qr-codes/xxx.png
        qrCodeUrl = qrCodeUrl.replace('/api/files/', '/uploads/')
      }
      if (qrCodeUrl && !qrCodeUrl.startsWith('http')) {
        qrCodeUrl = 'http://localhost:8080' + qrCodeUrl
      }
      
      setPendingAppointment({
        ...res.data,
        qrCodeUrl: qrCodeUrl
      })
      // Show QR code when booking is created
      setShowQRCode(true)
      setImageLoading(true)
      setImageError(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
      setShowPayModal(false)
    }
  }

  const handlePay = async () => {
    if (!pendingAppointment) return
    setPaying(true)
    try {
      const res = await api.post(`/api/appointments/${pendingAppointment.appointmentId}/pay`)
      setPendingAppointment(res.data)
      setBookingDone(true)
      fetchMyAppointments()
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const closeModal = () => {
    setShowPayModal(false)
    setSelectedDoctor(null)
    setPendingAppointment(null)
    setBookingDone(false)
    setShowQRCode(false)
    setImageLoading(true)
    setImageError(false)
  }

  const getStatusColor = (status) => {
    if (status === 'CONFIRMED') return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (status === 'COMPLETED') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Video className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Consult a Doctor</h1>
              <p className="text-white/90">Connect with expert doctors via video consultation</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 bg-white rounded-xl p-2 w-fit shadow-lg border border-gray-200">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'doctors' 
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md transform scale-105' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Available Doctors
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'appointments' 
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md transform scale-105' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          My Appointments {myAppointments.length > 0 && (
            <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">{myAppointments.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'doctors' && (
        <>
          {/* How it works */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, text: 'Select a doctor', icon: UserPlus },
                { step: 2, text: 'Pay consultation fee', icon: Clock },
                { step: 3, text: 'Get appointment time', icon: Calendar },
                { step: 4, text: 'Join video call', icon: Video }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                    </div>
                    <Icon className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Available Doctors
            </h2>
            {doctors.length === 0 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                No doctors registered yet
              </span>
            )}
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in-up">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-semibold mb-2">No doctors registered yet</p>
              <p className="text-gray-400">Admin can register doctors from the Admin panel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20"></div>
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {(doctor.fullName || 'D')[0]?.toUpperCase() || 'D'}
                      </div>
                      {doctor.availableToday && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{doctor.fullName}</h3>
                        {doctor.availableToday ? (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold border border-green-200 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-full font-semibold border border-gray-200">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-semibold mb-1">{doctor.specialization}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {doctor.experienceYears} years experience
                      </p>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-gray-700">
                          <span className="text-2xl font-bold text-green-600">₹{doctor.consultationFee}</span>
                          <span className="text-gray-400 text-sm ml-1">/ session</span>
                        </div>

                        <button
                          onClick={() => handleBookNow(doctor)}
                          disabled={!doctor.availableToday}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform shadow-md ${
                            doctor.availableToday
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Video className="w-5 h-5" />
                          {doctor.availableToday ? 'Book Now' : 'Not Available'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            My Appointments
          </h2>
          {myAppointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-semibold mb-2">No appointments yet</p>
              <p className="text-gray-400">Book your first consultation above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myAppointments.map((apt, index) => (
                <div 
                  key={apt.id} 
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {apt.doctorName?.[0]?.toUpperCase() || 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{apt.doctorName}</h3>
                        <p className="text-sm text-blue-600 font-medium">{apt.specialization}</p>
                        {apt.scheduledTime && (
                          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(apt.scheduledTime).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      <p className="text-lg font-bold text-green-600 mt-2">₹{apt.fee}</p>
                      {apt.paymentStatus === 'PENDING' && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await api.post(`/api/appointments/${apt.id}/pay`)
                              if (res.data.qrCodeUrl) {
                                alert('QR Code will be shown for payment')
                              }
                              fetchMyAppointments()
                            } catch (e) {}
                          }}
                          className="mt-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                      {apt.meetLink && (
                        <a
                          href={apt.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all text-center"
                        >
                          <Video className="w-4 h-4 inline mr-1" />
                          Join Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            {bookingDone ? (
              <div className="text-center py-12 px-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Booking Confirmed! 🎉</h3>
                <p className="text-gray-600 mb-4">Your consultation with <span className="font-semibold text-blue-600">{selectedDoctor.fullName}</span> has been confirmed.</p>
                {pendingAppointment?.scheduledTime && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Scheduled Time</p>
                    <p className="font-bold text-blue-800">
                      {new Date(pendingAppointment.scheduledTime).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {pendingAppointment?.meetLink && (
                  <a
                    href={pendingAppointment.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <Video className="w-5 h-5" />
                    Join Video Call
                  </a>
                )}
                <button onClick={closeModal} className="block mx-auto mt-6 text-sm text-gray-500 hover:text-gray-700 font-medium">
                  Close
                </button>
              </div>
            ) : !pendingAppointment ? (
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Book Consultation</h3>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {selectedDoctor.fullName?.[0]?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{selectedDoctor.fullName}</p>
                      <p className="text-sm text-blue-600">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-semibold">₹{selectedDoctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-semibold">₹50</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>Total</span>
                      <span className="text-green-600">₹{selectedDoctor.consultationFee + 50}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={closeModal} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all">
                    Cancel
                  </button>
                  <button onClick={handleBookStep} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    Generate Payment QR
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Complete Payment</h3>
                            
                {/* QR Code Display */}
                {pendingAppointment?.qrCodeUrl ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 mb-4 text-center shadow-lg">
                    <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                      <QrCode className="w-6 h-6 text-blue-600" />
                      Scan to Pay
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Scan this QR code to pay <span className="font-bold text-green-600">₹{pendingAppointment.fee}</span></p>
                    
                    {/* Image Loading State */}
                    {imageLoading && (
                      <div className="mb-4">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-3 font-medium">Loading QR code...</p>
                      </div>
                    )}
                    
                    {/* QR Code Image */}
                    {!imageError && (
                      <img 
                        src={pendingAppointment.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className={`mx-auto max-w-xs w-full h-auto border-4 border-white rounded-xl shadow-xl bg-white p-4 transition-all duration-500 transform hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setImageLoading(false)}
                        onError={(e) => {
                          console.error('Failed to load QR code image:', pendingAppointment.qrCodeUrl)
                          setImageLoading(false)
                          setImageError(true)
                        }}
                      />
                    )}
                    
                    {/* Error State */}
                    {imageError && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                        <p className="text-red-600 font-semibold mb-2">⚠️ Failed to load QR code image</p>
                        <p className="text-xs text-red-500 break-all mb-2"><strong>URL:</strong> {pendingAppointment.qrCodeUrl}</p>
                        <div className="text-left text-xs text-red-400 space-y-1">
                          <p>• Make sure the backend server is running on port 8080</p>
                          <p>• Verify the doctor has uploaded a QR code</p>
                          <p>• Check browser console for details</p>
                        </div>
                      </div>
                    )}
                    
                    {!imageError && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-700 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Secure Payment Gateway</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-4 text-center">
                    <QrCode className="w-16 h-16 text-orange-400 mx-auto mb-3" />
                    <p className="text-sm text-orange-800 font-medium">No QR code available</p>
                    <p className="text-xs text-orange-600 mt-1">Please contact admin to set up payment for this doctor</p>
                  </div>
                )}
                            
                {/* Payment Instructions */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-4">
                  <h5 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">?</div>
                    Payment Steps:
                  </h5>
                  <ol className="space-y-3 text-sm text-gray-700">
                    {[
                      'Open your payment app (GPay, PhonePe, Paytm, etc.)',
                      'Scan the QR code above',
                      `Complete the payment of ₹${pendingAppointment.fee}`,
                      'Click "I Have Paid" button below'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">{i + 1}</span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                            
                {/* Total Amount */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">Total Amount Paid</span>
                    <span className="text-3xl font-bold text-green-600">₹{pendingAppointment.fee}</span>
                  </div>
                </div>
                            
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={closeModal} 
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => {
                      handlePay()
                      setShowQRCode(false)
                    }}
                    disabled={paying || !pendingAppointment?.qrCodeUrl}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      paying || !pendingAppointment?.qrCodeUrl
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {paying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        I Have Paid
                      </>
                    )}
                  </button>
                </div>
                            
                {!pendingAppointment?.qrCodeUrl && (
                  <p className="text-xs text-red-600 mt-3 text-center font-medium">QR code not available. Please contact support.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultDoctor
