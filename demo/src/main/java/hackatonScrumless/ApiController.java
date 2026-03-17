package hackatonScrumless;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final WeatherService weatherService;
    private final PromptService promptService;

    public ApiController(WeatherService weatherService, PromptService promptService) {
        this.weatherService = weatherService;
        this.promptService = promptService;
    }

    @GetMapping("/weather")
    public String weather(@RequestParam(defaultValue = "false") boolean disaster) {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw";
        return weatherService.getWeather(disaster, token);
    }

    @PostMapping("/prompt")
    public String prompt(@RequestBody PromptRequest req) {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJbWFub2wiLCJleHAiOjE3NzM4MjI5MTR9.EjooIYhMX_BGpRTEZb8KSyoLSQoCezrgqobIpJ6pLMw";
        return promptService.sendPrompt(req.getSystem_prompt(), req.getUser_prompt(), token);
    }
}
