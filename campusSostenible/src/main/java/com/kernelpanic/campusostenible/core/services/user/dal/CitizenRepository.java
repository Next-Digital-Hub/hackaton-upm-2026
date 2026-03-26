package com.kernelpanic.campusostenible.core.services.user.dal;
import com.kernelpanic.campusostenible.core.domain.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {
}
