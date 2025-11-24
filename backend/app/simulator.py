# sensor simulator
import random

# Define floors and sensors per floor
BUILDING_LAYOUT = {
    1: ["HVAC_01", "HVAC_02"],
    2: ["HVAC_01"],
    3: ["HVAC_01", "HVAC_02", "HVAC_03"]
}

def simulate_single_sensor(floor, sensor_name):
    temperature = round(random.uniform(20, 100), 2)
    status = "CRITICAL" if temperature > 80 else "NORMAL"

    return {
        "sensor_id": f"F{floor}_{sensor_name}",
        "temperature": temperature,
        "status": status
    }

def generate_building_data():
    result = []

    for floor, sensors in BUILDING_LAYOUT.items():
        floor_data = {
            "floor": floor,
            "sensors": [simulate_single_sensor(floor, s) for s in sensors]
        }
        result.append(floor_data)

    return {"floors": result}
