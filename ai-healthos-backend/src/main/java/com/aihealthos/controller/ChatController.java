package com.aihealthos.controller;

import com.aihealthos.dto.ChatMessageRequest;
import com.aihealthos.dto.ChatMessageResponse;
import com.aihealthos.model.Appointment;
import com.aihealthos.model.ChatMessage;
import com.aihealthos.model.User;
import com.aihealthos.repository.AppointmentRepository;
import com.aihealthos.repository.ChatMessageRepository;
import com.aihealthos.repository.UserRepository;
import com.aihealthos.security.services.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true", maxAge = 3600)
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public ChatController(ChatMessageRepository chatMessageRepository,
                         AppointmentRepository appointmentRepository,
                         UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // Send a chat message
    @PostMapping("/send")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR')")
    @Transactional
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ChatMessageRequest request,
                                        Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long currentUserId = userDetails.getId();

            System.out.println("=== SEND MESSAGE REQUEST ===");
            System.out.println("Current User ID: " + currentUserId);
            System.out.println("Appointment ID: " + request.getAppointmentId());
            System.out.println("Message: " + request.getMessage());

            // Find appointment
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            System.out.println("Appointment Found - Patient ID: " + appointment.getPatient().getId() + 
                              ", Doctor ID: " + appointment.getDoctor().getId());

            // Verify user is part of this appointment
            if (!appointment.getPatient().getId().equals(currentUserId) &&
                !appointment.getDoctor().getId().equals(currentUserId)) {
                System.out.println("ERROR: User not part of appointment");
                return ResponseEntity.badRequest().body(Map.of("error", "You are not part of this appointment"));
            }

            // Determine receiver
            Long receiverId = appointment.getPatient().getId().equals(currentUserId)
                    ? appointment.getDoctor().getId()
                    : appointment.getPatient().getId();

            System.out.println("Receiver ID: " + receiverId);

            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            // Create chat message
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setAppointment(appointment);
            chatMessage.setSender(userRepository.findById(currentUserId).get());
            chatMessage.setReceiver(receiver);
            chatMessage.setMessage(request.getMessage());
            chatMessage.setIsRead(false);

            ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

            System.out.println("Message saved with ID: " + savedMessage.getId());
            System.out.println("=== END SEND MESSAGE REQUEST ===");

            return ResponseEntity.ok(convertToResponse(savedMessage));
        } catch (Exception e) {
            System.err.println("ERROR in sendMessage: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to send message",
                "details", e.getMessage()
            ));
        }
    }

    // Get chat history for an appointment
    @GetMapping("/history/{appointmentId}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR')")
    @Transactional
    public ResponseEntity<?> getChatHistory(@PathVariable Long appointmentId,
                                           Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long currentUserId = userDetails.getId();

            System.out.println("=== CHAT HISTORY REQUEST ===");
            System.out.println("Current User ID: " + currentUserId);
            System.out.println("Appointment ID: " + appointmentId);

            // Find appointment
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            System.out.println("Appointment Found - Patient ID: " + appointment.getPatient().getId() + 
                              ", Doctor ID: " + appointment.getDoctor().getId());

            // Verify user is part of this appointment
            if (!appointment.getPatient().getId().equals(currentUserId) &&
                !appointment.getDoctor().getId().equals(currentUserId)) {
                System.out.println("ERROR: User not part of appointment");
                return ResponseEntity.badRequest().body(Map.of("error", "You are not part of this appointment"));
            }

            // Mark messages as read for current user
            System.out.println("Marking messages as read...");
            chatMessageRepository.markMessagesAsRead(appointmentId, currentUserId);
            System.out.println("Messages marked as read");

            // Get all messages
            List<ChatMessage> messages = chatMessageRepository
                    .findByAppointmentIdOrderByCreatedAtAsc(appointmentId);

            System.out.println("Total messages found: " + messages.size());
            for (ChatMessage msg : messages) {
                System.out.println("Message ID: " + msg.getId() + 
                                 ", Sender: " + msg.getSender().getFullName() + 
                                 " (" + msg.getSender().getId() + ")" +
                                 ", Receiver: " + msg.getReceiver().getFullName() +
                                 " (" + msg.getReceiver().getId() + ")" +
                                 ", Message: " + msg.getMessage() +
                                 ", IsRead: " + msg.getIsRead());
            }

            List<ChatMessageResponse> response = messages.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            System.out.println("=== END CHAT HISTORY REQUEST ===");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR in getChatHistory: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to fetch chat history",
                "details", e.getMessage()
            ));
        }
    }

    // Get unread message count for an appointment
    @GetMapping("/unread/{appointmentId}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR')")
    public ResponseEntity<?> getUnreadCount(@PathVariable Long appointmentId,
                                           Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        // Find appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify user is part of this appointment
        if (!appointment.getPatient().getId().equals(currentUserId) &&
            !appointment.getDoctor().getId().equals(currentUserId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You are not part of this appointment"));
        }

        Long unreadCount = chatMessageRepository.countUnreadMessages(appointmentId, currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("appointmentId", appointmentId);
        response.put("unreadCount", unreadCount);

        return ResponseEntity.ok(response);
    }

    // Get all appointments with unread messages (for doctors)
    @GetMapping("/unread-appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getAppointmentsWithUnread(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long doctorId = userDetails.getId();

        List<Long> appointmentIds = chatMessageRepository
                .findAppointmentsWithUnreadMessages(doctorId);

        return ResponseEntity.ok(Map.of("appointments", appointmentIds));
    }

    // Mark all messages as read for an appointment
    @PutMapping("/mark-read/{appointmentId}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR')")
    @Transactional
    public ResponseEntity<?> markMessagesAsRead(@PathVariable Long appointmentId,
                                               Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        // Find appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify user is part of this appointment
        if (!appointment.getPatient().getId().equals(currentUserId) &&
            !appointment.getDoctor().getId().equals(currentUserId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "You are not part of this appointment"));
        }

        chatMessageRepository.markMessagesAsRead(appointmentId, currentUserId);

        return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
    }

    private ChatMessageResponse convertToResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setAppointmentId(message.getAppointment().getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getFullName());
        response.setSenderRole(message.getSender().getRole().name());
        response.setReceiverId(message.getReceiver().getId());
        response.setReceiverName(message.getReceiver().getFullName());
        response.setMessage(message.getMessage());
        response.setIsRead(message.getIsRead());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}
    