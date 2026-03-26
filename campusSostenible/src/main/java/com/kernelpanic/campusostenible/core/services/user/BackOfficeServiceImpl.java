package com.kernelpanic.campusostenible.core.services.user;

import com.kernelpanic.campusostenible.core.domain.BackOffice;
import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.services.user.dal.BackOfficeRepository;
import com.kernelpanic.campusostenible.core.services.user.dal.CitizenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BackOfficeServiceImpl implements BackOfficeService{

    private final BackOfficeRepository backOfficeRepository;

    @Override
    public BackOffice createUser(BackOffice backOffice) {
        return backOfficeRepository.save(backOffice);
    }
}
