package com.kernelpanic.campusostenible.ui.backoffice;

import com.kernelpanic.campusostenible.core.domain.BackOffice;
import com.kernelpanic.campusostenible.core.domain.Citizen;
import com.kernelpanic.campusostenible.core.services.user.BackOfficeService;
import com.kernelpanic.campusostenible.core.services.user.CitizenService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/auth")
public class AdminAuthController {

    private final BackOfficeService backOfficeService;

    public AdminAuthController(BackOfficeService backOfficeService) {
        this.backOfficeService = backOfficeService;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/register")
    public String registerCitizen(@ModelAttribute BackOffice backOffice) {
        backOfficeService.createUser(backOffice);
        return "redirect:/login?success";
    }
}
