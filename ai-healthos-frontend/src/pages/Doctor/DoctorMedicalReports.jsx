import { useState, useEffect } from 'react'
import api from '../../services/api'
import { FileText, User, Calendar, Search, AlertCircle, CheckCircle, XCircle, Eye, Filter } from 'lucide-react'

function DoctorMedicalReports() {
  const [reports, setReports] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterAbnormal, setFilterAbnormal] = useState('all')

  useEffect(() => {
    fetchAllReports()
  }, [])

  useEffect(() => {
    let result = reports
    if (search.trim() !== '') {
      result = result.filter(r =>
        r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.patientUsername?.toLowerCase().includes(search.toLowerCase()) ||
        r.fileName?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterAbnormal === 'abnormal') result = result.filter(r => r.abnormalValuesFound)
    if (filterAbnormal === 'normal') result = result.filter(r => !r.abnormalValuesFound)
    if (filterAbnormal === 'unreviewed') result = result.filter(r => !r.reviewedByDoctor)
    setFiltered(result)
  }, [search, reports, filterAbnormal])

  const fetchAllReports = async () => {
    try {
      const response = await api.get('/api/reports/all-patients')
      setReports(response.data)
      setFiltered(response.data)
    } catch (err) {
      setError('Failed to fetch medical reports')
    } finally {
      setLoading(false)
    }
  }

  const viewFile = async (reportId, fileName) => {
    try {
      const response = await api.get(`/api/reports/${reportId}/file`, {
        responseType: 'blob'
      })
      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      setError('Failed to open file')
    }
  }

  const markAsReviewed = async (reportId) => {
    try {
      await api.put(`/api/reports/${reportId}/review`)
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, reviewedByDoctor: true } : r))
    } catch (err) {
      setError('Failed to mark as reviewed')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  )

  const abnormalCount = reports.filter(r => r.abnormalValuesFound).length
  const unreviewedCount = reports.filter(r => !r.reviewedByDoctor).length

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Patients Medical Reports</h1>
              <p className="text-white/90">View lab reports uploaded by all patients</p>
            </div>
          </div>
          <div className="flex gap-3">
            {abnormalCount > 0 && (
              <span className="px-4 py-2 bg-red-500/30 backdrop-blur-sm rounded-xl text-sm font-bold border border-red-300/50">
                {abnormalCount} Abnormal
              </span>
            )}
            {unreviewedCount > 0 && (
              <span className="px-4 py-2 bg-yellow-500/30 backdrop-blur-sm rounded-xl text-sm font-bold border border-yellow-300/50">
                {unreviewedCount} Unreviewed
              </span>
            )}
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold border border-white/30">
              {reports.length} Total
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or file name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterAbnormal}
            onChange={e => setFilterAbnormal(e.target.value)}
            className="pl-12 pr-8 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white font-medium"
          >
            <option value="all">All Reports</option>
            <option value="abnormal">Abnormal Only</option>
            <option value="normal">Normal Only</option>
            <option value="unreviewed">Unreviewed</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold">No medical reports found</p>
          <p className="text-gray-400 text-sm mt-2">Reports will appear here once patients upload them</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((report, index) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border-2 animate-fade-in-up ${report.abnormalValuesFound ? 'border-red-200' : 'border-gray-100'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Patient + File Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{report.patientName || report.patientUsername}</p>
                    <p className="text-sm text-gray-500">@{report.patientUsername}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.abnormalValuesFound ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full text-sm font-bold shadow-md">
                      <XCircle className="w-4 h-4" /> Abnormal
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-md">
                      <CheckCircle className="w-4 h-4" /> Normal
                    </span>
                  )}
                  {report.reviewedByDoctor ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-bold shadow-md">
                      Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => markAsReviewed(report.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>

              {/* File info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{report.fileName}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
                <button
                  onClick={() => viewFile(report.id, report.fileName)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  View File
                </button>
              </div>

              {/* Abnormal values */}
              {report.abnormalValuesFound && report.abnormalValuesDetails && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500 mb-4">
                  <p className="text-sm font-bold text-red-700 mb-1">Abnormal Values Detected:</p>
                  <p className="text-sm text-red-600">{report.abnormalValuesDetails}</p>
                </div>
              )}

              {/* Simplified explanation */}
              {report.simplifiedExplanation && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-500 mb-4">
                  <p className="text-sm font-bold text-yellow-700 mb-1">Analysis:</p>
                  <p className="text-sm text-yellow-700">{report.simplifiedExplanation}</p>
                </div>
              )}

              {/* Extracted text preview */}
              {report.extractedText && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">Extracted Text (OCR):</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{report.extractedText.substring(0, 200)}...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorMedicalReports
