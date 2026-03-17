package com.kernelpanic.campusostenible.core.services.user;

import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.services.user.dal.CitizenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CitizenServiceImpl implements CitizenService{

    private final CitizenRepository citizenRepository;

    @Override
    public Citizen createUser(Citizen citizen) {
        return citizenRepository.save(citizen);
    }
}
