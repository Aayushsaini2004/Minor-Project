import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Heart, Shield, Stethoscope, Brain, Users, ArrowRight, Play, ChevronDown } from 'lucide-react'
import WelcomePage from './WelcomePage'

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [showWelcome, setShowWelcome] = useState(true)
  const landingRef = useRef(null)

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      // Hide welcome page after scrolling
      if (window.scrollY > 100) {
        setShowWelcome(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to landing section
  const scrollToLanding = () => {
    const welcomeHeight = window.innerHeight
    window.scrollTo({
      top: welcomeHeight,
      behavior: 'smooth'
    })
    setShowWelcome(false)
  }

  // Calculate avatar transform based on scroll
  const getAvatarTransform = () => {
    const scrollThreshold = 100
    const maxScroll = 300
    
    if (scrollY < scrollThreshold) {
      return {
        scale: 1,
        opacity: 1,
        translateY: 0,
        showFull: true
      }
    }
    
    const progress = Math.min((scrollY - scrollThreshold) / (maxScroll - scrollThreshold), 1)
    
    return {
      scale: 1 - (progress * 0.7),
      opacity: 1 - (progress * 0.3),
      translateY: -(progress * 150),
      showFull: progress < 0.5
    }
  }

  const avatarTransform = getAvatarTransform()

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Symptom Checker",
      description: "Advanced AI algorithms analyze your symptoms and provide accurate health assessments"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "AI Doctor Avatar",
      description: "Interactive AI doctor that speaks and listens, providing personalized health guidance"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Monitoring",
      description: "Track vital signs, health records, and get trend analysis with smart alerts"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emergency Detection",
      description: "Real-time emergency detection with instant alerts and ambulance tracking"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Medical Reports",
      description: "Upload and analyze medical reports with OCR technology and AI insights"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Doctor Dashboard",
      description: "Comprehensive tools for doctors to manage patients, triage, and appointments"
    }
  ]

  const stats = [
    { value: "24/7", label: "AI Support" },
    { value: "95%+", label: "Accuracy" },
    { value: "10K+", label: "Users" },
    { value: "50+", label: "Diseases" }
  ]

  return (
    <div className="relative">
      {/* Welcome Page - Slides to left on scroll */}
      {showWelcome && <WelcomePage onScrollToLanding={scrollToLanding} />}
      
      {/* Main Landing Page */}
      <div ref={landingRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-x-hidden relative">
      {/* Navbar with Mini Avatar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-200 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo with Mini Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mini AI Doctor Avatar in Navbar */}
              <div 
                className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden shadow-lg border-2 border-purple-400 transition-all duration-300 hover:scale-110 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 flex items-center justify-center">
                  {/* Mini face */}
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                    {/* Mini hair */}
                    <div className="absolute -top-0.5 sm:-top-1 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-purple-500 to-pink-500 rounded-t-full"></div>
                    {/* Mini eyes */}
                    <div className="absolute top-1.5 sm:top-2 left-0.5 w-1.5 h-1.5 sm:h-2 bg-white rounded-full">
                      <div className="absolute inset-0.5 bg-purple-500 rounded-full">
                        <div className="absolute bottom-0 right-0 w-0.5 h-0.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-1.5 sm:top-2 right-0.5 w-1.5 h-1.5 sm:h-2 bg-white rounded-full">
                      <div className="absolute inset-0.5 bg-purple-500 rounded-full">
                        <div className="absolute bottom-0 right-0 w-0.5 h-0.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    {/* Mini blush */}
                    <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 w-1 h-0.5 bg-pink-400 rounded-full opacity-60"></div>
                    <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 w-1 h-0.5 bg-pink-400 rounded-full opacity-60"></div>
                    {/* Mini smile */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-0.5 border-b border-pink-500 rounded-b-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Brand Name */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-pulse" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI HealthOS
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <button onClick={() => navigate('/login')} className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Login
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-4 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg lg:rounded-xl text-sm lg:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => navigate('/login')}
            >
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </nav>
      {/* Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-morph"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-morph" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-morph" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-8 sm:py-12 lg:py-0">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 relative z-10 order-2 lg:order-1">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium animate-fade-in border border-blue-200 shadow-lg hover:shadow-xl transition-shadow cursor-default">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 animate-spin-slow" />
                <span className="relative">
                  AI-Powered Healthcare
                  <span className="absolute -right-1.5 sm:-right-2 -top-1 sm:-top-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-ping"></span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight animate-slide-up relative">
                <span className="inline-block">Your Personal</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                  AI Health Assistant
                </span>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-xl sm:blur-2xl -z-10 animate-pulse"></div>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl animate-slide-up-delay leading-relaxed">
                Experience the future of healthcare with AI-driven symptom analysis, 
                intelligent diagnostics, and 24/7 medical guidance.
              </p>
            </div>

            {/* Typing Effect */}
            <div className="h-8 flex items-center justify-center lg:justify-start">
              <span className="text-blue-600 font-semibold animate-typing"></span>
              <span className="inline-block w-0.5 h-6 bg-blue-600 ml-1 animate-blink"></span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-delay">
              <button
                onClick={() => navigate('/register')}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 rounded-xl bg-white/20 animate-shimmer"></span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-4 sm:pt-6 lg:pt-8 animate-fade-in-delay-2">
              {stats.map((stat, index) => (
                <div key={index} className="group text-center p-2 sm:p-3 lg:p-4 bg-white/60 backdrop-blur rounded-lg sm:rounded-xl border border-transparent hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Anime AI Doctor Avatar */}
          <div 
            className="relative flex justify-center items-center transition-all duration-300 ease-out order-1 lg:order-2"
            style={{
              transform: `scale(${avatarTransform.scale}) translateY(${avatarTransform.translateY}px)`,
              opacity: avatarTransform.opacity
            }}
          >
            <div className="relative w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]">
              {/* Energy rings - Purple/Pink theme */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-400/40 animate-spin-slow shadow-[0_0_30px_rgba(168,85,247,0.5)]"></div>
              <div className="absolute inset-6 rounded-full border-4 border-dashed border-pink-400/40 animate-spin-reverse shadow-[0_0_30px_rgba(236,72,153,0.5)]" style={{ animationDuration: '15s' }}></div>
              <div className="absolute inset-12 rounded-full border-2 border-dashed border-purple-300/30 animate-spin-slow" style={{ animationDuration: '25s' }}></div>
              
              {/* Pulsing energy waves - Purple/Pink */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 opacity-20 animate-ping"></div>
              <div className="absolute inset-20 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 opacity-30 animate-ping" style={{ animationDelay: '0.7s' }}></div>
              <div className="absolute inset-24 rounded-full bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400 opacity-40 animate-ping" style={{ animationDelay: '1.4s' }}></div>

              {/* Main Avatar Container - Anime Style */}
              <div className="absolute inset-[15%] sm:inset-[20%] md:inset-[22%] lg:inset-24 xl:inset-28 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-0.5 sm:p-1 shadow-lg sm:shadow-xl md:shadow-2xl animate-glow">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
                  
                  {/* Anime Doctor Character */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 xl:w-64 xl:h-64">
                      
                      {/* Character Body - Cute Lab Coat */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 sm:w-36 md:w-40 lg:w-44 xl:w-48 h-20 sm:h-24 md:h-28 lg:h-30 xl:h-32 animate-breathe">
                        {/* Lab Coat with Details */}
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-pink-50 rounded-t-2xl sm:rounded-t-3xl shadow-xl sm:shadow-2xl"></div>
                          {/* Coat opening */}
                          <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full"></div>
                          {/* Pocket with cute pen */}
                          <div className="absolute top-4 sm:top-6 right-4 sm:right-8 w-6 sm:w-8 h-8 sm:h-10 bg-white border border-sm:border-2 border-pink-200 rounded-lg shadow-sm">
                            <div className="absolute top-0.5 sm:top-1 left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-3 sm:h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                            <div className="absolute top-0.5 sm:top-1 left-1 w-0.5 h-3 sm:h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                          </div>
                          {/* Medical Cross - Heart shaped */}
                          <div className="absolute top-2 sm:top-4 left-4 sm:left-8 w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-sm flex items-center justify-center shadow-md transform rotate-12">
                            <div className="w-3 sm:w-4 h-0.5 sm:h-1 bg-white absolute"></div>
                            <div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white absolute"></div>
                          </div>
                          {/* Cute buttons */}
                          <div className="absolute top-8 sm:top-12 left-1/2 transform -translate-x-1/2 flex flex-col gap-1 sm:gap-1.5">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400 rounded-full"></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Character Head */}
                      <div className="absolute top-4 sm:top-6 md:top-7 lg:top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 xl:w-32 xl:h-32 animate-breathe" style={{ animationDelay: '0.2s' }}>
                        {/* Face - Rounder and Cuter */}
                        <div className="relative w-full h-full bg-gradient-to-b from-orange-50 to-orange-100 rounded-full shadow-lg sm:shadow-xl">
                          {/* Hair - Zenzy Style (More Colorful & Spiky) */}
                          <div className="absolute -top-3 sm:-top-4 md:-top-5 -left-2 sm:-left-3 -right-2 sm:-right-3 h-14 sm:h-16 md:h-20 lg:h-24 bg-gradient-to-b from-purple-600 via-pink-500 to-purple-700 rounded-t-full overflow-hidden">
                            {/* Main hair spikes */}
                            <div className="absolute top-0 left-1 sm:left-2 w-3 sm:w-4 h-10 sm:h-14 md:h-16 bg-gradient-to-t from-purple-600 to-pink-400 rotate-12 rounded-full shadow-md"></div>
                            <div className="absolute top-0 left-6 sm:left-10 md:left-12 w-3 sm:w-4 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-purple-700 to-pink-500 rotate-6 rounded-full shadow-md"></div>
                            <div className="absolute top-0 left-12 sm:left-16 md:left-20 w-3 sm:w-4 h-14 sm:h-18 md:h-24 bg-gradient-to-t from-purple-600 to-pink-400 rounded-full shadow-lg"></div>
                            <div className="absolute top-0 right-6 sm:right-10 md:right-12 w-3 sm:w-4 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-purple-700 to-pink-500 -rotate-6 rounded-full shadow-md"></div>
                            <div className="absolute top-0 right-1 sm:right-2 w-3 sm:w-4 h-10 sm:h-14 md:h-16 bg-gradient-to-t from-purple-600 to-pink-400 -rotate-12 rounded-full shadow-md"></div>
                            {/* Hair shine */}
                            <div className="absolute top-2 left-4 w-2 h-6 bg-white/30 rounded-full rotate-12"></div>
                            <div className="absolute top-1 right-4 w-2 h-6 bg-white/30 rounded-full -rotate-12"></div>
                          </div>
                          
                          {/* Eyes - Extra Big Zenzy Style with Sparkles */}
                          <div className="absolute top-7 sm:top-9 md:top-11 lg:top-12 left-2 sm:left-3 md:left-4 w-8 sm:w-10 md:w-11 lg:w-12 h-9 sm:h-11 md:h-12 lg:h-14 bg-white rounded-full overflow-hidden shadow-inner animate-blink-slow border-2 border-purple-300">
                            <div className="absolute inset-1 bg-gradient-to-b from-purple-500 via-pink-400 to-purple-600 rounded-full">
                              {/* Multiple sparkles */}
                              <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                              <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                              <div className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            {/* Eye shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                          </div>
                          <div className="absolute top-7 sm:top-9 md:top-11 lg:top-12 right-2 sm:right-3 md:right-4 w-8 sm:w-10 md:w-11 lg:w-12 h-9 sm:h-11 md:h-12 lg:h-14 bg-white rounded-full overflow-hidden shadow-inner animate-blink-slow border-2 border-purple-300">
                            <div className="absolute inset-1 bg-gradient-to-b from-purple-500 via-pink-400 to-purple-600 rounded-full">
                              {/* Multiple sparkles */}
                              <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                              <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                              <div className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            {/* Eye shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                          </div>
                          
                          {/* Eyebrows - Cute & Expressive */}
                          <div className="absolute top-4 sm:top-6 md:top-7 lg:top-9 left-3 sm:left-4 md:left-5 w-7 sm:w-8 md:w-9 lg:w-10 h-1.5 sm:h-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transform -rotate-12"></div>
                          <div className="absolute top-4 sm:top-6 md:top-7 lg:top-9 right-3 sm:right-4 md:right-5 w-7 sm:w-8 md:w-9 lg:w-10 h-1.5 sm:h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transform rotate-12"></div>
                          
                          {/* Mouth - Cute Cat-like Smile */}
                          <div className="absolute bottom-5 sm:bottom-6 md:bottom-7 lg:bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-4 sm:w-5 md:w-6 h-2 sm:h-2.5 md:h-3 border-b-3 sm:border-b-4 border-pink-500 rounded-b-full"></div>
                            {/* Cat mouth lines */}
                            <div className="absolute -left-1 sm:-left-1.5 top-0 w-1.5 sm:w-2 h-1.5 sm:h-2 border-l-2 border-pink-500 rounded-l-full"></div>
                            <div className="absolute -right-1 sm:-right-1.5 top-0 w-1.5 sm:w-2 h-1.5 sm:h-2 border-r-2 border-pink-500 rounded-r-full"></div>
                          </div>
                          
                          {/* Extra Blush - More Prominent */}
                          <div className="absolute bottom-7 sm:bottom-9 md:bottom-10 lg:bottom-12 left-1 sm:left-2 w-5 sm:w-6 md:w-7 h-3 sm:h-3.5 md:h-4 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full opacity-70 blur-sm"></div>
                          <div className="absolute bottom-7 sm:bottom-9 md:bottom-10 lg:bottom-12 right-1 sm:right-2 w-5 sm:w-6 md:w-7 h-3 sm:h-3.5 md:h-4 bg-gradient-to-l from-pink-300 to-pink-400 rounded-full opacity-70 blur-sm"></div>
                          
                          {/* Star decoration on face */}
                          <div className="absolute top-4 sm:top-5 right-3 sm:right-4 text-yellow-400 text-xs sm:text-sm animate-pulse">✦</div>
                          <div className="absolute top-5 sm:top-6 left-2 sm:left-3 text-pink-400 text-[10px] sm:text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
                          
                          {/* No glasses - Cuter without */}
                        </div>
                      </div>

                      {/* Stethoscope - Cute Pink/Purple */}
                      <div className="absolute top-24 sm:top-28 md:top-32 lg:top-36 left-1/2 transform -translate-x-1/2 animate-swing" style={{ transformOrigin: 'top center' }}>
                        <div className="relative">
                          {/* Stethoscope tube - Pink */}
                          <div className="w-14 sm:w-16 md:w-18 lg:w-20 h-14 sm:h-16 md:h-18 lg:h-20 border-2 sm:border-3 border-pink-500 rounded-full shadow-md"></div>
                          <div className="absolute -top-1 sm:-top-1.5 md:-top-1.5 lg:-top-2 left-1/2 transform -translate-x-1/2 w-3 sm:w-3.5 md:w-3.5 lg:w-4 h-3 sm:h-3.5 md:h-3.5 lg:h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-md"></div>
                          {/* Chest piece - Heart shaped */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 sm:w-7 md:w-7.5 lg:w-8 h-6 sm:h-7 md:h-7.5 lg:h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center">
                            <div className="w-3 sm:w-3.5 md:w-3.5 lg:w-4 h-3 sm:h-3.5 md:h-3.5 lg:h-4 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full animate-pulse shadow-inner"></div>
                          </div>
                        </div>
                      </div>

                      {/* Energy particles around character - Purple/Pink */}
                      <div className="absolute inset-0 animate-spin-slow" style={{ transformOrigin: 'center' }}>
                        <div className="absolute -top-2 left-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,1)] animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin-reverse" style={{ transformOrigin: 'center' }}>
                        <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin-slow" style={{ transformOrigin: 'center', animationDuration: '15s' }}>
                        <div className="absolute top-1/2 -left-2 w-3 h-3 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(251,113,133,1)] animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin-reverse" style={{ transformOrigin: 'center', animationDuration: '15s' }}>
                        <div className="absolute top-1/2 -right-2 w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,1)] animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator - Cute */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-3.5 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 px-2 sm:px-3 md:px-3.5 lg:px-4 py-1 sm:py-1.5 md:py-1.5 lg:py-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-full backdrop-blur-sm shadow-lg animate-fade-in">
                    <span className="inline-block w-1.5 sm:w-1.5 md:w-1.5 lg:w-2 h-1.5 sm:h-1.5 md:h-1.5 lg:h-2 bg-green-400 rounded-full animate-ping"></span>
                    <span className="text-white text-[10px] sm:text-xs md:text-xs lg:text-sm font-semibold whitespace-nowrap">✨ AI Doctor Online ✨</span>
                  </div>

                  {/* Scanning line effect - Purple */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 animate-scan"></div>
                  </div>
                </div>
              </div>

              {/* Floating medical icons with trails - More Colorful */}
              {avatarTransform.showFull && (
                <>
              <div className="absolute -top-2 sm:-top-3 md:-top-3.5 lg:-top-4 left-1/4 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-float-delay group hover:scale-110 sm:hover:scale-125 transition-transform cursor-default">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-pink-500 animate-pulse" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-pink-500/20 animate-ping"></div>
              </div>
              <div className="absolute top-1/4 -right-4 sm:-right-6 md:-right-7 lg:-right-8 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-float-delay-2 group hover:scale-110 sm:hover:scale-125 transition-transform cursor-default">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-500 animate-pulse" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-purple-500/20 animate-ping"></div>
              </div>
              <div className="absolute bottom-1/4 -left-4 sm:-left-6 md:-left-7 lg:-left-8 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-float-delay-3 group hover:scale-110 sm:hover:scale-125 transition-transform cursor-default">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-green-500 animate-pulse" />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-green-500/20 animate-ping"></div>
              </div>
              
              {/* Extra floating elements - Zenzy Colors */}
              <div className="absolute top-1/2 -right-6 sm:-right-8 md:-right-10 lg:-right-12 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-float" style={{ animationDelay: '2s' }}>
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-white animate-pulse" />
              </div>
              <div className="absolute bottom-1/3 -left-6 sm:-left-8 md:-left-10 lg:-left-12 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md sm:rounded-lg shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-float" style={{ animationDelay: '3s' }}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-white animate-pulse" />
              </div>
              <div className="absolute top-1/3 -left-8 sm:-left-10 md:-left-13 lg:-left-16 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-md sm:rounded-lg shadow-md sm:shadow-lg md:shadow-lg lg:shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-float" style={{ animationDelay: '1.5s' }}>
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-white animate-pulse" />
              </div>
              {/* Extra kawaii elements */}
              <div className="absolute top-1/4 -left-10 sm:-left-12 md:-left-14 lg:-left-20 p-1.5 sm:p-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-md sm:rounded-lg shadow-lg animate-float" style={{ animationDelay: '2.5s' }}>
                <span className="text-white text-sm sm:text-base">⭐</span>
              </div>
              <div className="absolute bottom-1/4 -right-10 sm:-right-12 md:-right-14 lg:-right-20 p-1.5 sm:p-2 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-md sm:rounded-lg shadow-lg animate-float" style={{ animationDelay: '3.5s' }}>
                <span className="text-white text-sm sm:text-base">💫</span>
              </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Scroll Down</span>
            <ChevronDown className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in-up">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Powered by advanced AI and machine learning to provide accurate, 
              personalized healthcare assistance
            </p>
            <div className="mt-6 flex justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
              <span className="w-3 h-1 bg-purple-600 rounded-full"></span>
              <span className="w-3 h-1 bg-purple-600 rounded-full"></span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 overflow-hidden ${
                  isVisible['features'] ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    {React.cloneElement(feature.icon, { className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" })}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 animate-on-scroll overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free account in seconds" },
              { step: "02", title: "Describe Symptoms", desc: "Chat with AI doctor or use symptom checker" },
              { step: "03", title: "Get Insights", desc: "Receive AI-powered health recommendations" }
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center group ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-ping opacity-20"></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div id="cta" className={`relative p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl text-white shadow-2xl overflow-hidden ${isVisible['cta'] ? 'animate-scale-in' : 'opacity-0'}`}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your Healthcare?
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100">
                Join thousands of users who trust AI HealthOS for their health needs
              </p>
              <button
                onClick={() => navigate('/register')}
                className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-white text-blue-600 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Today
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
            <span className="text-xl sm:text-2xl font-bold">AI HealthOS</span>
          </div>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            Advanced AI-powered healthcare platform for everyone
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button onClick={() => navigate('/login')} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Register
            </button>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <p className="text-xs sm:text-sm text-gray-500">
              © 2026 AI HealthOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-200px) translateX(100px); opacity: 0; }
        }
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(59, 130, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        @keyframes typing {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
        @keyframes blink-slow {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes swing {
          0%, 100% { transform: translateX(-50%) rotate(-5deg); }
          50% { transform: translateX(-50%) rotate(5deg); }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.2s backwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.4s backwards;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s backwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 5s ease-in-out 0.5s infinite;
        }
        .animate-float-delay-2 {
          animation: float-delay 5s ease-in-out 1s infinite;
        }
        .animate-float-delay-3 {
          animation: float-delay 5s ease-in-out 1.5s infinite;
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-typing {
          animation: typing 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        .animate-blink-slow {
          animation: blink-slow 4s ease-in-out infinite;
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
