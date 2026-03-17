import requests
import os

LLM_API_URL = os.getenv("LLM_API_URL", "")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")


def ask_llm(system_prompt: str, user_prompt: str) -> str:
    """
    Llama a la API LLM proporcionada por el hackathon.
    Si no está configurada, usa la API de Anthropic como fallback.
    """
    if LLM_API_URL and LLM_API_KEY:
        return _call_hackaton_llm(system_prompt, user_prompt)
    else:
        return _call_anthropic_fallback(system_prompt, user_prompt)


def _call_hackaton_llm(system_prompt: str, user_prompt: str) -> str:
    """Llama a la API del hackathon (dos parámetros: system_prompt + user_prompt)."""
    try:
        response = requests.post(
            LLM_API_URL,
            headers={
                "Authorization": f"Bearer {LLM_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "system_prompt": system_prompt,
                "user_prompt": user_prompt,
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("response") or data.get("text") or data.get("content") or str(data)
    except Exception as e:
        return f"Error al contactar el LLM: {str(e)}"


def _call_anthropic_fallback(system_prompt: str, user_prompt: str) -> str:
    """Fallback usando Anthropic si no hay API del hackathon configurada."""
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return message.content[0].text
    except Exception as e:
        return f"Error LLM: {str(e)}"


def build_system_prompt(user) -> str:
    """
    Construye el system_prompt personalizado según el perfil del ciudadano.
    Aquí está la magia del Prompt Engineering del reto.
    """
    necesidades = user.necesidades_especiales or "ninguna"

    return f"""Eres un experto en gestión de emergencias climáticas y protección civil en España.
Tu misión es dar instrucciones claras, concretas y personalizadas para proteger la vida del ciudadano.

Perfil del ciudadano:
- Provincia: {user.provincia}
- Tipo de vivienda: {user.tipo_vivienda}
- Necesidades especiales: {necesidades}

Reglas de comportamiento:
1. Da siempre instrucciones específicas para su tipo de vivienda. 
   - Si vive en un SÓTANO y hay lluvias intensas, indícale URGENTEMENTE que suba a plantas superiores.
   - Si vive en PISO ALTO y hay viento fuerte, alértale sobre ventanas y balcones.
   - Si vive en CASA DE CAMPO, considera el acceso a vías de evacuación.
2. Si tiene necesidades especiales (silla de ruedas, persona dependiente, mascotas), adapta las instrucciones.
3. Sé directo y claro. Usa frases cortas. En emergencias no hay tiempo para textos largos.
4. Indica el nivel de urgencia: URGENTE, PRECAUCIÓN o INFORMATIVO.
5. Responde siempre en español."""


def build_user_prompt(weather_data: dict) -> str:
    """Construye el user_prompt con los datos meteorológicos actuales."""
    return f"""Situación meteorológica actual en {weather_data.get('provincia')}:
- Temperatura: {weather_data.get('temperatura')}°C
- Precipitación: {weather_data.get('precipitacion')} mm
- Viento: {weather_data.get('viento_kmh')} km/h
- Condición: {weather_data.get('descripcion')}
- Nivel de alerta detectado: {weather_data.get('nivel_alerta')}

¿Qué debe hacer este ciudadano para protegerse? Da instrucciones concretas y personalizadas."""
