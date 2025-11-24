# FastAPI endpoints
from fastapi import APIRouter
from .simulator import generate_building_data
from .models import BuildingData

router = APIRouter()

@router.get("/building", response_model=BuildingData)
def get_all_floors():
    return generate_building_data()
