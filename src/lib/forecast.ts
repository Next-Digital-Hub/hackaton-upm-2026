// lib/forecast.ts
// Open-Meteo API - Free, no API key needed
// Maps Spanish provinces to coordinates and fetches 7-day forecast

interface ProvinceCoords {
  lat: number
  lon: number
}

const PROVINCE_COORDS: Record<string, ProvinceCoords> = {
  'Madrid': { lat: 40.4168, lon: -3.7038 },
  'Barcelona': { lat: 41.3874, lon: 2.1686 },
  'Valencia': { lat: 39.4699, lon: -0.3763 },
  'Sevilla': { lat: 37.3891, lon: -5.9845 },
  'Bizkaia': { lat: 43.2630, lon: -2.9350 },
  'Alicante': { lat: 38.3452, lon: -0.4815 },
}

export interface DayForecast {
  date: string
  dayName: string
  tempMax: number
  tempMin: number
  precipitationSum: number
  weatherCode: number
  weatherIcon: string
  weatherLabel: string
}

function getWeatherInfo(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Despejado' }
  if (code <= 3) return { icon: '⛅', label: 'Parcialmente nublado' }
  if (code <= 48) return { icon: '🌫️', label: 'Niebla' }
  if (code <= 55) return { icon: '🌦️', label: 'Llovizna' }
  if (code <= 65) return { icon: '🌧️', label: 'Lluvia' }
  if (code <= 67) return { icon: '🌧️❄️', label: 'Lluvia helada' }
  if (code <= 77) return { icon: '🌨️', label: 'Nieve' }
  if (code <= 82) return { icon: '⛈️', label: 'Chubascos' }
  if (code <= 86) return { icon: '🌨️', label: 'Chubascos de nieve' }
  if (code <= 99) return { icon: '⛈️', label: 'Tormenta' }
  return { icon: '🌤️', label: 'Variable' }
}

export async function get7DayForecast(province: string): Promise<DayForecast[]> {
  const coords = PROVINCE_COORDS[province] || PROVINCE_COORDS['Madrid']

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Europe%2FMadrid&forecast_days=7`

  const res = await fetch(url, {
    next: { revalidate: 3600 } // Cache 1 hour (sustainability)
  })

  if (!res.ok) {
    throw new Error('Error fetching forecast from Open-Meteo')
  }

  const data = await res.json()
  const days: DayForecast[] = []

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  for (let i = 1; i < data.daily.time.length; i++) {
    const date = new Date(data.daily.time[i])
    const weatherInfo = getWeatherInfo(data.daily.weather_code[i])

    days.push({
      date: data.daily.time[i],
      dayName: dayNames[date.getDay()],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      precipitationSum: data.daily.precipitation_sum[i],
      weatherCode: data.daily.weather_code[i],
      weatherIcon: weatherInfo.icon,
      weatherLabel: weatherInfo.label
    })
  }

  return days
}
