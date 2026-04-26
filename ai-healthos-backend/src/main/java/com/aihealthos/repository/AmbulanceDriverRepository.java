package com.aihealthos.repository;

import com.aihealthos.model.AmbulanceDriver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceDriverRepository extends JpaRepository<AmbulanceDriver, Long> {
    
    Optional<AmbulanceDriver> findByPhoneNumber(String phoneNumber);
    
    List<AmbulanceDriver> findByCityAndAvailableTrue(String city);
    
    List<AmbulanceDriver> findByAvailableTrue();
    
    List<AmbulanceDriver> findByActiveTrue();
    
    @Query("SELECT a FROM AmbulanceDriver a WHERE a.city = :city AND a.available = true AND a.active = true")
    List<AmbulanceDriver> findAvailableDriversByCity(@Param("city") String city);
    
    @Query("SELECT a FROM AmbulanceDriver a WHERE a.latitude IS NOT NULL AND a.longitude IS NOT NULL AND a.available = true")
    List<AmbulanceDriver> findAvailableDriversWithLocation();
}
