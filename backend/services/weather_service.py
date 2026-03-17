import requests
from dotenv import load_dotenv
import os

load_dotenv()


def get_weather(disaster: bool = False) -> dict:

    """
    Obtiene la previsión meteorológica
    """
    URL ="http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=true" if disaster else "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=false"
    try:
        response = requests.get(URL, headers={"Authorization": f'Bearer {os.getenv("BEARER_TOKEN")}'})

        response.raise_for_status()
        raw = response.json()

        # Normalizar respuesta para uso interno
        return _normalize_weather(raw)

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}


def _normalize_weather(raw: dict) -> dict:
    """Normaliza la respuesta de Open-Meteo a un formato propio."""
    current = raw.get("current", {})
    weather_code = current.get("weather_code", 0)

    return {
        "provincia": provincia,
        "temperatura": current.get("temperature_2m"),
        "precipitacion": current.get("precipitation"),
        "viento_kmh": current.get("wind_speed_10m"),
        "codigo_clima": weather_code,
        "descripcion": _weather_code_to_text(weather_code),
        "nivel_alerta": _get_alert_level(current),
        "raw": raw,
    }


def _weather_code_to_text(code: int) -> str:
    codes = {
        0: "Despejado",
        1: "Principalmente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Niebla",
        51: "Llovizna ligera",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        71: "Nieve ligera",
        80: "Chubascos",
        95: "Tormenta",
        99: "Tormenta con granizo",
    }
    return codes.get(code, "Condiciones variables")


def _get_alert_level(current: dict) -> str:
    """Determina el nivel de alerta según datos meteorológicos."""
    precip = current.get("precipitation", 0) or 0
    viento = current.get("wind_speed_10m", 0) or 0
    code = current.get("weather_code", 0) or 0

    if precip > 50 or viento > 80 or code in [95, 99]:
        return "rojo"
    elif precip > 20 or viento > 50 or code in [65, 71]:
        return "amarillo"
    else:
        return "verde"
