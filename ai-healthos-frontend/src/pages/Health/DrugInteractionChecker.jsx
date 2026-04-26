import { useState } from 'react'
import { Pill, AlertTriangle, CheckCircle, XCircle, Info, Plus, Trash2, ArrowRight } from 'lucide-react'
import api from '../../services/api'

function DrugInteractionChecker() {
  const [selectedDrugs, setSelectedDrugs] = useState([])
  const [currentDrug, setCurrentDrug] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Indian medicine database
  const drugDatabase = [
    { brand: 'crocin', generic: 'acetaminophen' },
    { brand: 'calpol', generic: 'acetaminophen' },
    { brand: 'dolo', generic: 'acetaminophen' },
    { brand: 'paracetamol', generic: 'acetaminophen' },
    { brand: 'brufen', generic: 'ibuprofen' },
    { brand: 'combiflam', generic: 'ibuprofen' },
    { brand: 'ibuprofen', generic: 'ibuprofen' },
    { brand: 'augmentin', generic: 'amoxicillin' },
    { brand: 'azithral', generic: 'azithromycin' },
    { brand: 'glycomet', generic: 'metformin' },
    { brand: 'ecosprin', generic: 'aspirin' },
    { brand: 'aspirin', generic: 'aspirin' },
    { brand: 'telma', generic: 'telmisartan' },
    { brand: 'pantocid', generic: 'pantoprazole' },
    { brand: 'warfarin', generic: 'warfarin' },
    { brand: 'clopidogrel', generic: 'clopidogrel' },
    { brand: 'omeprazole', generic: 'omeprazole' },
    { brand: 'simvastatin', generic: 'simvastatin' },
    { brand: 'lisinopril', generic: 'lisinopril' }
  ]

  // Known dangerous interactions
  const knownInteractions = {
    // HIGH SEVERITY - Dangerous Combinations
    'acetaminophen-alcohol': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Liver Damage Risk!',
      description: 'Paracetamol + Alcohol → Serious liver damage risk', 
      recommendation: 'Avoid alcohol completely while taking Paracetamol/Crocin/Dolo' 
    },
    'aspirin-warfarin': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Dangerous Bleeding Risk!',
      description: 'Aspirin + Warfarin → Severe bleeding risk', 
      recommendation: 'Never combine without doctor supervision' 
    },
    'aspirin-clopidogrel': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Bleeding Alert!',
      description: 'Aspirin + Clopidogrel → High bleeding risk', 
      recommendation: 'Use only under strict medical supervision' 
    },
    'warfarin-ibuprofen': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Bleeding + Stomach Ulcer Risk!',
      description: 'Warfarin + Ibuprofen/Brufen → Bleeding and ulcer risk', 
      recommendation: 'Use Paracetamol instead for pain relief' 
    },
    'metformin-alcohol': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Lactic Acidosis Risk!',
      description: 'Metformin/Glycomet + Alcohol → Life-threatening condition', 
      recommendation: 'Avoid alcohol while on Metformin' 
    },
    'lisinopril-potassium': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'High Potassium Alert!',
      description: 'BP Medicine + Potassium → Dangerously high potassium levels', 
      recommendation: 'Monitor potassium levels regularly' 
    },
    'simvastatin-grapefruit': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Muscle Damage Risk!',
      description: 'Simvastatin + Grapefruit → Severe muscle damage', 
      recommendation: 'Avoid grapefruit and grapefruit juice completely' 
    },
    'omeprazole-clopidogrel': { 
      severity: 'HIGH', 
      emoji: '❌',
      title: 'Heart Attack Risk!',
      description: 'Omeprazole + Clopidogrel → Reduces heart protection', 
      recommendation: 'Use Pantoprazole/Pantocid instead' 
    },
    
    // MEDIUM SEVERITY - Caution Needed
    'aspirin-ibuprofen': { 
      severity: 'MEDIUM', 
      emoji: '⚠️',
      title: 'Reduced Heart Protection',
      description: 'Aspirin + Ibuprofen → Reduces heart benefits', 
      recommendation: 'Take aspirin 30 min before ibuprofen' 
    },
    'warfarin-acetaminophen': { 
      severity: 'MEDIUM', 
      emoji: '⚠️',
      title: 'Monitor Blood Thinning',
      description: 'Warfarin + Paracetamol → May increase blood thinning', 
      recommendation: 'Monitor INR levels regularly' 
    },
    'lisinopril-ibuprofen': { 
      severity: 'MEDIUM', 
      emoji: '⚠️',
      title: 'BP Medicine + Painkiller Risk!',
      description: 'BP Medicine (Telma) + Painkiller (Brufen) → Kidney risk', 
      recommendation: 'Use occasionally only, not regularly' 
    },
    'telmisartan-ibuprofen': { 
      severity: 'MEDIUM', 
      emoji: '⚠️',
      title: 'BP Medicine + Painkiller Alert!',
      description: 'Telma + Brufen/Combiflam → Reduces BP control', 
      recommendation: 'Monitor blood pressure regularly' 
    },
    'simvastatin-warfarin': { 
      severity: 'MEDIUM', 
      emoji: '⚠️',
      title: 'Increased Bleeding Risk',
      description: 'Simvastatin + Warfarin → More bleeding risk', 
      recommendation: 'Monitor INR levels closely' 
    },
    'acetaminophen-ibuprofen': {
      severity: 'LOW',
      emoji: '✅',
      title: 'Generally Safe',
      description: 'Paracetamol + Ibuprofen → Safe to combine',
      recommendation: 'Can be taken together for better pain relief'
    }
  }

  // Get generic name from brand
  const getGenericName = (drug) => {
    const drugLower = drug.toLowerCase()
    const found = drugDatabase.find(d => d.brand === drugLower)
    return found ? found.generic : drugLower
  }

  const addDrug = () => {
    if (!currentDrug.trim()) {
      setError('Please enter a medication name')
      return
    }

    if (selectedDrugs.includes(currentDrug.trim())) {
      setError('Medication already added')
      return
    }

    setSelectedDrugs([...selectedDrugs, currentDrug.trim()])
    setCurrentDrug('')
    setError('')
  }

  const removeDrug = (index) => {
    setSelectedDrugs(selectedDrugs.filter((_, i) => i !== index))
    setResult(null)
  }

  const checkInteractions = async () => {
    if (selectedDrugs.length < 2) {
      setError('Please add at least 2 medications to check interactions')
      return
    }

    setChecking(true)
    setResult(null)
    setError('')

    try {
      const interactions = []
      const drugData = []

      // Fetch drug data from FDA API
      for (const drug of selectedDrugs) {
        try {
          const generic = getGenericName(drug)
          const response = await fetch(`https://api.fda.gov/drug/label.json?search=${generic}&limit=1`)
          const data = await response.json()

          if (data.results && data.results.length > 0) {
            const info = data.results[0]
            drugData.push({
              name: drug,
              generic: generic,
              warnings: info.warnings?.[0] || 'No specific warnings',
              sideEffects: info.adverse_reactions?.[0] || 'No side effects info'
            })
          } else {
            drugData.push({
              name: drug,
              generic: generic,
              warnings: 'No data available',
              sideEffects: ''
            })
          }
        } catch (err) {
          drugData.push({
            name: drug,
            generic: getGenericName(drug),
            warnings: 'API Error',
            sideEffects: ''
          })
        }
      }

      // Check for known interactions
      for (let i = 0; i < selectedDrugs.length; i++) {
        for (let j = i + 1; j < selectedDrugs.length; j++) {
          const drug1 = selectedDrugs[i].toLowerCase()
          const drug2 = selectedDrugs[j].toLowerCase()
          const generic1 = getGenericName(drug1)
          const generic2 = getGenericName(drug2)

          // Check all possible combinations
          const keys = [
            `${generic1}-${generic2}`,
            `${generic2}-${generic1}`,
            `${drug1}-${drug2}`,
            `${drug2}-${drug1}`
          ]

          for (const key of keys) {
            if (knownInteractions[key]) {
              interactions.push({
                drug1: selectedDrugs[i],
                drug2: selectedDrugs[j],
                ...knownInteractions[key]
              })
              break
            }
          }
        }
      }

      setResult({
        interactions,
        drugData,
        totalChecked: selectedDrugs.length,
        totalInteractions: interactions.length
      })
    } catch (err) {
      setError('Failed to check interactions. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'from-red-500 to-rose-600'
      case 'MEDIUM': return 'from-yellow-500 to-amber-500'
      case 'LOW': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'HIGH': return <XCircle className="w-6 h-6" />
      case 'MEDIUM': return <AlertTriangle className="w-6 h-6" />
      case 'LOW': return <CheckCircle className="w-6 h-6" />
      default: return <Info className="w-6 h-6" />
    }
  }

  const availableDrugs = ['Crocin', 'Dolo', 'Brufen', 'Combiflam', 'Augmentin', 'Azithral', 'Glycomet', 'Ecosprin', 'Aspirin', 'Telma', 'Pantocid', 'Warfarin', 'Clopidogrel', 'Omeprazole', 'Simvastatin', 'Lisinopril', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Alcohol']

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl animate-pulse-glow">
              <Pill className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold animate-fade-in-down">Drug Interaction Checker</h1>
              <p className="text-white/90">Check dangerous medication interactions before taking multiple drugs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication */}
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          Add Your Medications
        </h2>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type medication name (e.g., Aspirin, Warfarin, Metformin...)"
              value={currentDrug}
              onChange={(e) => setCurrentDrug(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDrug()}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              list="drugSuggestions"
            />
            <datalist id="drugSuggestions">
              {availableDrugs.map(drug => (
                <option key={drug} value={drug} />
              ))}
            </datalist>
          </div>
          <button
            onClick={addDrug}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl animate-fade-in">
            <p className="text-orange-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Selected Drugs */}
        {selectedDrugs.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-bold text-gray-700">Your Medications ({selectedDrugs.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedDrugs.map((drug, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 flex items-center justify-between animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{drug}</span>
                  </div>
                  <button
                    onClick={() => removeDrug(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 hover:shadow-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={checkInteractions}
          disabled={checking || selectedDrugs.length < 2}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {checking ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
              Checking Interactions...
            </>
          ) : (
            <>
              <Pill className="w-6 h-6" />
              Check Drug Interactions
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Summary */}
          <div className={`rounded-2xl p-8 text-white shadow-xl ${
            result.totalInteractions > 0 
              ? 'bg-gradient-to-r from-orange-500 to-red-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                {result.totalInteractions > 0 ? (
                  <AlertTriangle className="w-12 h-12" />
                ) : (
                  <CheckCircle className="w-12 h-12" />
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {result.totalInteractions > 0 
                    ? `${result.totalInteractions} Interaction${result.totalInteractions > 1 ? 's' : ''} Found!` 
                    : 'No Interactions Found!'}
                </h3>
                <p className="text-white/90 text-lg">
                  Checked {result.totalChecked} medications
                </p>
              </div>
            </div>
          </div>

          {/* Interactions List */}
          {result.interactions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                ⚠️ Dangerous Combinations Found!
              </h3>
              {result.interactions.map((interaction, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border-3 animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    borderColor: interaction.severity === 'HIGH' ? '#dc2626' : interaction.severity === 'MEDIUM' ? '#f59e0b' : '#10b981'
                  }}
                >
                  {/* Warning Header */}
                  <div className={`bg-gradient-to-r ${getSeverityColor(interaction.severity)} text-white rounded-xl p-5 mb-4`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{interaction.emoji}</span>
                      <div>
                        <h4 className="text-2xl font-bold">{interaction.title}</h4>
                        <p className="text-white/90 text-sm mt-1">{interaction.severity} SEVERITY</p>
                      </div>
                    </div>
                  </div>

                  {/* Drugs Combination */}
                  <div className="bg-gray-50 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-center gap-4 text-lg">
                      <div className="bg-blue-100 px-5 py-3 rounded-lg border-2 border-blue-300">
                        <p className="font-bold text-blue-800">💊 {interaction.drug1}</p>
                      </div>
                      <span className="text-2xl font-bold text-red-600">+</span>
                      <div className="bg-purple-100 px-5 py-3 rounded-lg border-2 border-purple-300">
                        <p className="font-bold text-purple-800">💊 {interaction.drug2}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Details */}
                  <div className="space-y-3">
                    <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                      <p className="text-sm text-red-700 mb-1 font-bold">⚠️ Warning:</p>
                      <p className="text-red-800 font-semibold text-lg">{interaction.description}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                      <p className="text-sm text-yellow-700 mb-1 font-bold">💡 Recommendation:</p>
                      <p className="text-yellow-800 font-semibold">{interaction.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Interactions */}
          {result.interactions.length === 0 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">✅ Safe Combination!</h3>
                  <p className="text-white/90 text-lg">
                    No dangerous interactions found between your selected medications. However, always consult your doctor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Drug Information from FDA */}
          {result.drugData && result.drugData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Pill className="w-7 h-7 text-blue-600" />
                📋 Drug Information (FDA Data)
              </h3>
              {result.drugData.map((drug, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Pill className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{drug.name}</h4>
                      <p className="text-sm text-gray-500">Generic: {drug.generic}</p>
                    </div>
                  </div>
                  
                  {drug.warnings && drug.warnings !== 'No data available' && drug.warnings !== 'API Error' && (
                    <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500 mb-3">
                      <p className="text-sm text-orange-700 mb-1 font-bold">⚠️ Warnings:</p>
                      <p className="text-orange-800 text-sm">{drug.warnings.substring(0, 200)}...</p>
                    </div>
                  )}
                  
                  {drug.sideEffects && (
                    <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                      <p className="text-sm text-red-700 mb-1 font-bold">💥 Side Effects:</p>
                      <p className="text-red-800 text-sm">{drug.sideEffects.substring(0, 200)}...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-yellow-800 mb-2">⚠️ Medical Disclaimer</p>
            <p className="text-yellow-700 text-sm">
              This tool provides general information only and is not a substitute for professional medical advice. 
              Always consult your doctor or pharmacist before starting, stopping, or changing any medication. 
              Drug interactions can vary based on individual health conditions, age, and other factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrugInteractionChecker
