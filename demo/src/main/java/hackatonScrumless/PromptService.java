package hackatonScrumless;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PromptService {

    private final RestTemplate restTemplate;

    public PromptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String sendPrompt(String systemPrompt, String userPrompt, String token) {

        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";

        PromptRequest request = new PromptRequest();
        request.setSystem_prompt(systemPrompt);
        request.setUser_prompt(userPrompt);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PromptRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }

    public String sendPromptLLM(String systemPrompt, String userPrompt, String token) {

        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";

        // Crear el body
        PromptRequest request = new PromptRequest();
        request.setSystem_prompt(systemPrompt);
        request.setUser_prompt(userPrompt);

        // Cabeceras
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PromptRequest> entity = new HttpEntity<>(request, headers);

        // Llamada POST
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
        );

        return response.getBody();
    }

}
