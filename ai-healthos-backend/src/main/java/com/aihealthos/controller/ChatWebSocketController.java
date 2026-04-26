package com.aihealthos.controller;

import com.aihealthos.dto.ChatMessageResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle chat messages
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/group")
    public ChatMessageResponse sendMessage(@Payload ChatMessageRequest message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setSenderId(message.getSenderId());
        response.setSenderName(message.getSenderName());
        response.setMessage(message.getMessage());
        response.setAppointmentId(message.getAppointmentId());
        response.setCreatedAt(LocalDateTime.now());
        response.setIsRead(false);
        
        return response;
    }

    // Handle typing notifications
    @MessageMapping("/chat.typing")
    @SendTo("/topic/typing")
    public ChatMessageResponse sendTyping(@Payload ChatMessageRequest message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setSenderId(message.getSenderId());
        response.setSenderName(message.getSenderName());
        response.setIsTyping(true);
        return response;
    }

    // Request class for incoming messages
    public static class ChatMessageRequest {
        private Long senderId;
        private String senderName;
        private String message;
        private Long appointmentId;
        private Boolean isTyping;

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
        public Boolean getIsTyping() { return isTyping; }
        public void setIsTyping(Boolean isTyping) { this.isTyping = isTyping; }
    }
}
