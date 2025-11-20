
## Basic flow:

1.  Generate random temperature every few seconds
    
2.  Apply logic:
    
    -   Temp > 80 → `CRITICAL`
        
    -   Else → `NORMAL`
        
3.  Send result through FastAPI
    
4.  Auto-refresh endpoint each request