import datetime
import random
from datetime import date, timedelta
from typing import List
from src.domain.weather import WeatherData

class WeatherUseCases:
    def get_random_weather(self, disaster: bool = False) -> WeatherData:
        current_date = datetime.datetime.now()

        # Tmax entre 15 y 30
        tmax_val = random.uniform(15.0, 30.0)
        # Tmin entre 10 y Tmax - 2 (mínimo 10)
        tmin_val = random.uniform(8.0, tmax_val - 2.0)
        tmed_val = (tmax_val + tmin_val) / 2.0

        if disaster:
            # Catástrofe: prec superior a 700 y menor a 1500
            prec_val = random.uniform(700.1, 1499.9)
        else:
            # Normal: prec entre 0 y 70
            prec_val = random.uniform(0.0, 70.0)

        return WeatherData(
            altitud="186",
            dir=None,
            fecha=current_date.strftime("%Y-%m-%d"),
            horaHrMax=random.choice(["07:30", "23:40", "Varias"]),
            horaHrMin=random.choice(["13:50", "03:00", "12:00"]),
            horaPresMax=None,
            horaPresMin=None,
            horaracha=None,
            horatmax=random.choice(["13:27", "13:42", "Varias", "12:19"]),
            horatmin=random.choice(["05:22", "06:29", "16:13", "21:07"]),
            hrMax=str(random.randint(90, 100)),
            hrMedia=str(random.randint(65, 96)),
            hrMin=str(random.randint(50, 86)),
            indicativo="8337X",
            nombre="TURÍS",
            prec=f"{prec_val:.1f}".replace(".", ","),
            presMax=None,
            presMin=None,
            provincia="VALENCIA",
            racha=None,
            sol=None,
            tmax=f"{tmax_val:.1f}".replace(".", ","),
            tmed=f"{tmed_val:.1f}".replace(".", ","),
            tmin=f"{tmin_val:.1f}".replace(".", ","),
            velmedia=None
        )
