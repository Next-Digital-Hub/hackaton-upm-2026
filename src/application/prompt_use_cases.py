from src.invoke_llm import invoke_llm

class PromptUseCases:
    def invoke(self, system_prompt: str, user_prompt: str) -> str:
        return invoke_llm(system_prompt, user_prompt)
