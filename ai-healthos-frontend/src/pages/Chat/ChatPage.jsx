import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, Search, ArrowLeft, CheckCheck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const isDoctor = user?.role === 'DOCTOR';
  const isPatient = user?.role === 'USER';

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const endpoint = isDoctor ? '/api/appointments/doctor/all' : '/api/appointments/my';
      console.log('Fetching appointments from:', endpoint);
      
      const response = await api.get(endpoint);
      
      console.log('📋 All appointments:', response.data);
      console.log('📊 Total count:', response.data.length);
      
      // Show all appointments with their status
      response.data.forEach((apt, index) => {
        console.log(`${index + 1}. Appointment #${apt.id} - Status: ${apt.status} - ${apt.doctorName || apt.patientName}`);
      });
      
      // Filter only approved/completed/confirmed appointments
      const approvedAppointments = response.data.filter(
        apt => apt.status === 'APPROVED' || 
               apt.status === 'COMPLETED' || 
               apt.status === 'CONFIRMED' ||
               apt.status === 'PAID'
      );
      
      console.log('✅ Approved appointments:', approvedAppointments.length);
      
      setAppointments(approvedAppointments);
      
      // Auto-select first appointment if none selected
      if (approvedAppointments.length > 0 && !selectedAppointment) {
        setSelectedAppointment(approvedAppointments[0]);
        console.log('Auto-selected appointment:', approvedAppointments[0].id);
      } else if (approvedAppointments.length === 0) {
        console.warn('⚠️ No approved appointments found!');
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      console.error('Response:', error.response?.data);
      alert('Failed to load appointments: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history
  const fetchMessages = async (appointmentId) => {
    if (!appointmentId) return;
    
    try {
      console.log('Fetching messages for appointment:', appointmentId);
      const response = await api.get(`/api/chat/history/${appointmentId}`);
      console.log('Messages received:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedAppointment) return;

    console.log('Sending message:', { 
      appointmentId: selectedAppointment.id, 
      message: newMessage.trim() 
    });

    try {
      setSending(true);
      const response = await api.post('/api/chat/send', {
        appointmentId: selectedAppointment.id,
        message: newMessage.trim()
      });

      console.log('Message sent successfully:', response.data);
      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (selectedAppointment?.id) {
      fetchMessages(selectedAppointment.id);
      
      // Auto-refresh messages every 2 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedAppointment.id);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [selectedAppointment]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get other person info with detailed information
  const getOtherPerson = (appointment) => {
    if (isDoctor) {
      // Doctor is viewing - show patient info
      return {
        name: appointment.patientName || 'Patient',
        username: appointment.patientUsername ? `@${appointment.patientUsername}` : '',
        role: 'Patient',
        avatar: '👨‍🦱',
        email: appointment.patientEmail || ''
      };
    } else {
      // Patient is viewing - show doctor info
      return {
        name: appointment.doctorName || 'Doctor',
        role: 'Doctor',
        specialization: appointment.doctorSpecialization || 'General Physician',
        avatar: '👨‍⚕️',
        experience: appointment.doctorExperience ? `${appointment.doctorExperience} years exp` : ''
      };
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Filter appointments by search
  const filteredAppointments = appointments.filter(apt => {
    const otherPerson = getOtherPerson(apt);
    return otherPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 text-lg">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden flex">
      {/* Left Sidebar - Conversations */}
      <div className={`${selectedAppointment ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-gray-200`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <h2 className="text-xl font-bold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 font-semibold mb-2">No conversations yet</p>
              <p className="text-gray-500 text-sm mb-4">
                {isPatient 
                  ? 'Book an appointment and wait for doctor approval'
                  : 'No patient appointments approved yet'
                }
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xs">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Note:</strong> Only APPROVED, CONFIRMED, PAID, or COMPLETED appointments appear here
                </p>
              </div>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const otherPerson = getOtherPerson(appointment);
              const isSelected = selectedAppointment?.id === appointment.id;
              
              return (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                      {otherPerson.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{otherPerson.name}</h3>
                        {appointment.appointmentDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium truncate">
                        {otherPerson.role}
                        {isDoctor && otherPerson.username && ` • ${otherPerson.username}`}
                        {!isDoctor && otherPerson.specialization && ` • ${otherPerson.specialization}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {appointment.status === 'APPROVED' ? '✅ Approved' : 
                         appointment.status === 'CONFIRMED' ? '✅ Confirmed' :
                         appointment.status === 'PAID' ? '✅ Paid' :
                         appointment.status === 'COMPLETED' ? '✅ Completed' :
                         appointment.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      {selectedAppointment ? (
        <div className={`${!selectedAppointment ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              {getOtherPerson(selectedAppointment).avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {getOtherPerson(selectedAppointment).name}
              </h3>
              <p className="text-xs text-blue-100">
                {getOtherPerson(selectedAppointment).role}
                {isDoctor && getOtherPerson(selectedAppointment).username && ` • ${getOtherPerson(selectedAppointment).username}`}
                {!isDoctor && getOtherPerson(selectedAppointment).specialization && ` • ${getOtherPerson(selectedAppointment).specialization}`}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-20 h-20 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm mt-2">Start the conversation with {getOtherPerson(selectedAppointment).name}</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.senderId === user?.id;
                  
                  return (
                    <div key={msg.id || index}>
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          </div>
                          
                          <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                            <p className="text-xs text-gray-500">
                              {formatTime(msg.createdAt)}
                            </p>
                            {isCurrentUser && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium">Select a conversation</p>
            <p className="text-gray-400 text-sm mt-2">Choose from your existing conversations</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
