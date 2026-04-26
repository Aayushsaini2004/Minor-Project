import { useAuth } from '../../contexts/AuthContext'
import { Activity, Heart, FileText, Camera, MessageCircle, ArrowRight, Pill, AlertTriangle, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user } = useAuth()

  const features = [
    {
      title: 'AI Symptom Checker',
      description: 'Check your symptoms using AI-powered diagnosis',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      link: '/symptom-checker',
      delay: '0'
    },
    {
      title: 'Health Records',
      description: 'Track your vital signs and health metrics',
      icon: Heart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      link: '/health-records',
      delay: '100'
    },
    {
      title: 'Medical Reports',
      description: 'Upload and analyze your medical reports',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/medical-reports',
      delay: '200'
    },
    {
      title: 'Image Diagnosis',
      description: 'Get AI analysis of medical images',
      icon: Camera,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      link: '/image-diagnosis',
      delay: '300'
    },
    {
      title: 'Generic Medicine Finder',
      description: 'Find affordable generic alternatives for branded medicines',
      icon: Pill,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      link: '/generic-medicine-finder',
      delay: '400'
    },
    {
      title: 'Drug Interaction Checker',
      description: 'Check dangerous medication interactions',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      link: '/drug-interaction-checker',
      delay: '500'
    },
    {
      title: 'Medicine Reminder',
      description: 'Set reminders and never miss your medication',
      icon: Bell,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      link: '/medicine-reminder',
      delay: '550'
    },
    {
      title: 'Consult Doctor',
      description: 'Chat with AI doctor for instant advice',
      icon: MessageCircle,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      link: '/ai-avatar-doctor',
      delay: '600'
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 animate-fade-in-down">
            Welcome back, {user?.fullName || user?.username}! 👋
          </h1>
          <p className="text-white/90 text-base sm:text-lg">
            How are you feeling today? Let us help you stay healthy and fit.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Health Score</p>
              <p className="text-3xl font-bold text-blue-600">85%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Records</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Consultations</p>
              <p className="text-3xl font-bold text-purple-600">5</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-4 sm:p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.color.replace('from-', 'text-').split(' ')[0]}`} />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{feature.description}</p>
                  <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Get Started
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
