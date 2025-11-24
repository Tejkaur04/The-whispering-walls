
## Basic flow:

1.  Generate random temperature every few seconds
    
2.  Apply logic:
    
    -   Temp > 80 → `CRITICAL`
        
    -   Else → `NORMAL`
        
3.  Send result through FastAPI
    
4.  Auto-refresh endpoint each request



## something like this returns from API
```
{
  "floors": [
    {
      "floor": 1,
      "sensors": [
        { "sensor_id": "F1_HVAC_01", "temperature": 72.5, "status": "NORMAL" },
        { "sensor_id": "F1_HVAC_02", "temperature": 89.1, "status": "CRITICAL" }
      ]
    },
    {
      "floor": 2,
      "sensors": [
        { "sensor_id": "F2_HVAC_01", "temperature": 65.1, "status": "NORMAL" }
      ]
    }
  ]
}
```
