package hackatonScrumless;

public class PromptRequest {
    private String system_prompt;
    private String user_prompt;

    // getters y setters

    public void setSystem_prompt(String system_prompt) {
        this.system_prompt = system_prompt;
    }

    public void setUser_prompt(String user_prompt) {
        this.user_prompt = user_prompt;
    }

    public String getSystem_prompt() {
        return system_prompt;
    }

    public String getUser_prompt() {
        return user_prompt;
    }
}