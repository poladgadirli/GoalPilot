package main.java.com.example.AIPlanner.Repositories;

import com.example.AIPlanner.Entities.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(
            String email,
            String code
    );
}