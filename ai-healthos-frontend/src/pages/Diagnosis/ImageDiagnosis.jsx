import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Camera, Upload, Image as ImageIcon, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'

function ImageDiagnosis() {
  const [diagnoses, setDiagnoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchDiagnoses()
  }, [])

  const fetchDiagnoses = async () => {
    try {
      const response = await api.get('/api/image-diagnosis/history')
      setDiagnoses(response.data)
    } catch (err) {
      // silently ignore - no records yet is fine
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show image preview
    const reader = new FileReader()
    reader.onloadend = () => setSelectedImage(reader.result)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.post('/api/image-diagnosis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(response.data)
      fetchDiagnoses()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image')
    } finally {
      setUploading(false)
    }
  }

  const getRiskColor = (risk) => {
    if (!risk) return 'text-gray-600'
    if (risk === 'HIGH' || risk === 'CRITICAL') return 'text-red-600'
    if (risk === 'MEDIUM') return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Camera className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">AI Image Diagnosis</h1>
              <p className="text-white/90">Upload medical images for AI-powered analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Upload className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Medical Image</h2>
          </div>
          
          <div className="border-3 border-dashed border-orange-300 rounded-2xl p-12 text-center bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 group">
            {selectedImage && (
              <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <img src={selectedImage} alt="Selected" className="max-h-64 mx-auto rounded-xl object-contain shadow-lg" />
              </div>
            )}
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:shadow-xl'
              }`}
            >
              <Camera className="w-5 h-5" />
              {uploading ? '🔍 Analyzing...' : 'Select Image'}
            </label>
            <p className="mt-4 text-sm text-gray-600 font-medium">📷 Supported formats: JPG, PNG</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {result && result.prediction && (
            <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 animate-fade-in-up">
              <h3 className="font-bold text-orange-800 mb-4 text-xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Analysis Result
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-orange-200">
                  <p className="text-xs text-gray-500 mb-1">Prediction</p>
                  <p className="text-lg font-bold text-gray-800">{result.prediction}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-200">
                  <p className="text-xs text-gray-500 mb-1">Confidence</p>
                  <p className={`text-2xl font-bold ${result.confidenceScore >= 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.confidenceScore ? (result.confidenceScore * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              {result.possibleConditions && result.possibleConditions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Possible Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleConditions.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-full font-medium border border-orange-200">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.recommendation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">💡 Recommendation</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{result.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Previous Diagnoses */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Previous Diagnoses</h2>
          </div>
          
          {diagnoses.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No diagnoses yet</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first medical image above</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {diagnoses.map((diagnosis, index) => (
                <div 
                  key={diagnosis.id} 
                  className="p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(diagnosis.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <p className="font-bold text-gray-800 text-lg mb-2">{diagnosis.prediction || 'Processing...'}</p>
                  {diagnosis.confidenceScore > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className={`font-bold ${
                        diagnosis.confidenceScore >= 0.7 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {(diagnosis.confidenceScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {diagnosis.recommendation && (
                    <p className="text-xs text-gray-600 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 leading-relaxed">
                      💡 {diagnosis.recommendation}
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

export default ImageDiagnosis
