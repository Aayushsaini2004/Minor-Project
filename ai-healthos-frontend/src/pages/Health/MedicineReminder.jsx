  import { useState, useEffect, useCallback } from 'react'
import { Bell, Plus, Clock, Calendar, AlertCircle, Check, X, Trash2, Settings, Moon, Sun, Mail, MessageCircle } from 'lucide-react'

function MedicineReminder() {
  const [medicines, setMedicines] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    type: 'tablet',
    times: [''],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    email: '',
    whatsapp: ''
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medicines')
    if (saved) {
      setMedicines(JSON.parse(saved))
    }
    
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines))
  }, [medicines])

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [medicines])

  const checkReminders = useCallback(() => {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    medicines.forEach(med => {
      med.times.forEach(time => {
        if (time === currentTime && !med.taken?.includes(now.toDateString())) {
          // Show notification
          if (Notification.permission === 'granted') {
            new Notification('💊 Medicine Reminder', {
              body: `Time to take ${med.name} (${med.dose})`,
              icon: '/vite.svg'
            })
          }
        }
      })
    })
  }, [medicines])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '']
    }))
  }

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }))
  }

  const updateTimeSlot = (index, value) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newMedicine = {
      id: editingMedicine ? editingMedicine.id : Date.now(),
      ...formData,
      times: formData.times.filter(t => t),
      taken: editingMedicine?.taken || [],
      createdAt: editingMedicine?.createdAt || new Date().toISOString()
    }

    if (editingMedicine) {
      setMedicines(prev => prev.map(m => m.id === editingMedicine.id ? newMedicine : m))
    } else {
      setMedicines(prev => [...prev, newMedicine])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      dose: '',
      type: 'tablet',
      times: [''],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: '',
      email: '',
      whatsapp: ''
    })
    setShowForm(false)
    setEditingMedicine(null)
  }

  const markAsTaken = (medId) => {
    const today = new Date().toDateString()
    setMedicines(prev => prev.map(med => {
      if (med.id === medId) {
        const taken = [...(med.taken || []), today]
        return { ...med, taken }
      }
      return med
    }))
  }

  const deleteMedicine = (id) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(m => m.id !== id))
    }
  }

  const editMedicine = (med) => {
    setEditingMedicine(med)
    setFormData({
      name: med.name,
      dose: med.dose,
      type: med.type,
      times: med.times.length > 0 ? med.times : [''],
      startDate: med.startDate,
      endDate: med.endDate || '',
      instructions: med.instructions || '',
      email: med.email || '',
      whatsapp: med.whatsapp || ''
    })
    setShowForm(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light')
  }

  // Stats
  const todayDoses = medicines.reduce((acc, med) => acc + med.times.length, 0)
  const takenToday = medicines.reduce((acc, med) => {
    const today = new Date().toDateString()
    return acc + (med.taken?.includes(today) ? med.times.length : 0)
  }, 0)
  const missedDoses = todayDoses - takenToday

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Bell className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Medicine Reminder</h1>
                <p className="text-white/90">Never miss your medication again!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-blue-600">{medicines.length}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Medicines</div>
          </div>
          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-purple-600">{todayDoses}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Doses</div>
          </div>
          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-green-600">{takenToday}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taken</div>
          </div>
          <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-red-600">{missedDoses}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Missed</div>
          </div>
        </div>

        {/* Add Medicine Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Medicine
        </button>

        {/* Medicine Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                  </h2>
                  <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Medicine Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Paracetamol"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold">Dosage *</label>
                    <input
                      type="text"
                      value={formData.dose}
                      onChange={(e) => setFormData({...formData, dose: e.target.value})}
                      placeholder="e.g., 500mg"
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    >
                      <option value="tablet">Tablet</option>
                      <option value="capsule">Capsule</option>
                      <option value="syrup">Syrup</option>
                      <option value="injection">Injection</option>
                      <option value="drops">Drops</option>
                      <option value="ointment">Ointment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Reminder Times *</label>
                  {formData.times.map((time, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        required
                        className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                      />
                      {formData.times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    + Add Another Time
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">End Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Special Instructions</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    placeholder="e.g., Take after meals"
                    rows="3"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-6 py-3 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <button
                    onClick={requestNotificationPermission}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Enable Browser Notifications</span>
                  </button>
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                  💡 Tip: Set medicine times and you'll get notified!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medicines List */}
        <div className="space-y-4">
          {medicines.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="text-6xl mb-4">💊</div>
              <h3 className="text-2xl font-bold mb-2">No Medicines Added</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Click the button above to add your first medicine reminder
              </p>
            </div>
          ) : (
            medicines.map((med) => {
              const today = new Date().toDateString()
              const isTaken = med.taken?.includes(today)
              
              return (
                <div
                  key={med.id}
                  className={`rounded-xl p-6 shadow-lg transition-all hover:shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} ${isTaken ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{med.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {med.type}
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {med.dose} {med.instructions && `• ${med.instructions}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editMedicine(med)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg"
                        title="Edit"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteMedicine(med.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {med.times.map((time, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                      >
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">{time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {med.startDate} {med.endDate && `→ ${med.endDate}`}
                    </div>
                    {!isTaken && (
                      <button
                        onClick={() => markAsTaken(med.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Mark as Taken
                      </button>
                    )}
                    {isTaken && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <Check className="w-4 h-4" />
                        Taken Today
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicineReminder
