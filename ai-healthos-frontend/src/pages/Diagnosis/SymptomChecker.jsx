import { useState } from 'react'
import api from '../../services/api'
import { Activity, User, Calendar, FileText, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.post('/api/diagnosis', {
        symptoms,
        age: age ? parseInt(age) : null,
        gender,
        additionalNotes: notes
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Activity className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">AI Symptom Checker</h1>
              <p className="text-white/90">Get instant AI-powered health analysis</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Describe Your Symptoms</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms *
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                rows="5"
                placeholder="e.g., I have a headache, fever, and sore throat..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                rows="3"
                placeholder="Any other relevant information..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Check Symptoms
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Analysis Result</h2>
              </div>
              
              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Predicted Condition</p>
                  <p className="text-xl font-bold text-blue-800">{result.predictedDisease}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Risk Level</p>
                    <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold ${
                      result.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                      result.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                      {result.riskLevel}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Confidence</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(result.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">💡 Recommendation</p>
                  <p className="text-gray-800 leading-relaxed">{result.recommendation}</p>
                </div>

                {result.possibleConditions && result.possibleConditions.length > 0 && (
                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">Possible Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {result.possibleConditions.map((condition, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full font-medium border border-blue-200"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 animate-fade-in-up">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Activity className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Analyze</h3>
              <p className="text-gray-600">Fill in your symptoms on the left and get instant AI-powered health insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SymptomChecker
