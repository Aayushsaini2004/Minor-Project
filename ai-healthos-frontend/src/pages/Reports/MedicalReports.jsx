import { useState, useEffect } from 'react'
import api from '../../services/api'
import { FileText, Upload, AlertTriangle, CheckCircle, Calendar, File } from 'lucide-react'

function MedicalReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports/history')
      setReports(response.data)
    } catch (err) {
      setError('Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError('')

    try {
      await api.post('/api/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchReports()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload report')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Medical Reports</h1>
              <p className="text-white/90">Upload and analyze your medical documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Upload New Report</h2>
        </div>
        
        <div className="border-3 border-dashed border-purple-300 rounded-2xl p-12 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="report-upload"
          />
          <label
            htmlFor="report-upload"
            className={`cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
            }`}
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Select File to Upload'}
          </label>
          <p className="mt-4 text-sm text-gray-600 font-medium">📄 Supported formats: PDF, JPG, PNG</p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <File className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Reports</h2>
        </div>
        
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No reports uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload your first medical report above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <div 
                key={report.id} 
                className="p-6 border-2 border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{report.fileName}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold ${
                    report.abnormalValuesFound 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    {report.abnormalValuesFound ? (
                      <><AlertTriangle className="w-3 h-3" /> Abnormal</>
                    ) : (
                      <><CheckCircle className="w-3 h-3" /> Normal</>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.uploadedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                {report.extractedText && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {report.extractedText.substring(0, 150)}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicalReports
