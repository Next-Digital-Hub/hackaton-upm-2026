package hackatonScrumless;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class H2ConsoleController {

    @RequestMapping("/db")
    public String redirectToH2() {
        return "redirect:/db/";
    }
}
