package com.aihealthos.repository;

import com.aihealthos.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByAppointmentIdOrderByCreatedAtAsc(Long appointmentId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.appointment.id = :appointmentId " +
           "AND cm.receiver.id = :receiverId AND cm.isRead = false")
    List<ChatMessage> findUnreadMessages(@Param("appointmentId") Long appointmentId, 
                                         @Param("receiverId") Long receiverId);

    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.appointment.id = :appointmentId " +
           "AND cm.receiver.id = :receiverId AND cm.isRead = false")
    Long countUnreadMessages(@Param("appointmentId") Long appointmentId, 
                             @Param("receiverId") Long receiverId);

    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true WHERE cm.appointment.id = :appointmentId " +
           "AND cm.receiver.id = :receiverId AND cm.isRead = false")
    void markMessagesAsRead(@Param("appointmentId") Long appointmentId, 
                           @Param("receiverId") Long receiverId);

    @Query("SELECT DISTINCT cm.appointment.id FROM ChatMessage cm " +
           "WHERE cm.receiver.id = :receiverId AND cm.isRead = false")
    List<Long> findAppointmentsWithUnreadMessages(@Param("receiverId") Long receiverId);
}
