# response models
from pydantic import BaseModel
from typing import List

class SensorData(BaseModel):
    sensor_id: str
    temperature: float
    status: str

class FloorData(BaseModel):
    floor: int
    sensors: List[SensorData]

class BuildingData(BaseModel):
    floors: List[FloorData]
