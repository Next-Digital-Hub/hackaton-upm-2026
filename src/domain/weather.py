from dataclasses import dataclass
from typing import Optional

@dataclass
class WeatherData:
    altitud: str
    dir: Optional[str]
    fecha: str
    horaHrMax: str
    horaHrMin: str
    horaPresMax: Optional[str]
    horaPresMin: Optional[str]
    horaracha: Optional[str]
    horatmax: str
    horatmin: str
    hrMax: str
    hrMedia: str
    hrMin: str
    indicativo: str
    nombre: str
    prec: str
    presMax: Optional[str]
    presMin: Optional[str]
    provincia: str
    racha: Optional[str]
    sol: Optional[str]
    tmax: str
    tmed: str
    tmin: str
    velmedia: Optional[str]
