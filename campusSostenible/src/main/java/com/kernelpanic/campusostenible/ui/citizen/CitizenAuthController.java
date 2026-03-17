package com.kernelpanic.campusostenible.ui.citizen;

import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.services.user.CitizenService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/citizen/auth")
public class CitizenAuthController {

    private final CitizenService citizenService;

    public CitizenAuthController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/register")
    public String registerCitizen(@ModelAttribute Citizen citizen) {
        citizenService.createUser(citizen);
        return "redirect:/login?success";
    }
}
