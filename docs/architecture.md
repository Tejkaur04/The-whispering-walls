
# **The Whispering Walls — System Architecture**

The Whispering Walls is a lightweight digital-twin system that lets a building “speak” by sharing the health of its internal systems — like HVAC units — through real-time simulated sensor data and a visual dashboard.

The architecture is intentionally clean, modular, and teamwork-friendly.

----------

# **1. High-Level Overview**

The Whispering Walls consists of **three main layers**:

1.  **Sensor Simulation Layer (Backend Logic)**  
    Creates dynamic, realistic HVAC temperature readings and status outputs.
    
2.  **API Layer (FastAPI Backend)**  
    Exposes sensor data as JSON through REST endpoints.
    
3.  **Visualization Layer (Frontend Dashboard)**  
    Fetches the backend data and presents it as live metrics and charts.
    

DevOps tooling is used to ensure consistency, reliability, and simple deployment.

----------

# **2. Architecture Diagram (Text-Based)**

 ```sql 
      ┌──────────────────────────────┐
      │  Sensor Simulator (Backend)  │
      │  Fake IoT data, logic rules  │
      └───────────────┬──────────────┘
                      │
                      ▼
      ┌──────────────────────────────┐
      │       FastAPI Backend        │
      │  /sensor → JSON response     │
      └───────────────┬──────────────┘
                      │
                      ▼
      ┌──────────────────────────────┐
      │       Frontend Dashboard     │
      │ React UI → charts & status   │
      └───────────────┬──────────────┘
                      │
                      ▼
            “Whispering Walls” UX
   (The building speaks through data)
   ``` 


----------

# **3. Component Breakdown**

## **3.1. Sensor Simulator (backend/app/simulator.py)**

A small Python module that mimics real HVAC behavior.

-   Creates random temperatures
    
-   Applies domain logic:
    
    -   > 80°C → **CRITICAL**
        
    -   ≤ 80°C → **NORMAL**
        
-   Converts everything into structured sensor data
    

This is what “gives the walls a voice.”

----------

## **3.2. FastAPI Backend (backend/app/api.py)**

Responsibilities:

-   Provide consistent JSON through `/sensor`
    
-   Validate responses with Pydantic models
    
-   Handle API routing and documentation
    
-   Stay lightweight and stateless (good for scaling)
    

----------

## **3.3. Frontend Dashboard (React UI)**

Responsibilities:

-   Poll `/sensor` every few seconds
    
-   Display real-time readings
    
-   Show color-coded system status
    
-   Plot temperature history
    

The dashboard visually represents what the “walls” are whispering.

----------

# **4. Data Flow**

1.  Frontend requests:
    

`GET /sensor` 

2.  Backend runs the simulator
    
3.  Simulator returns something like:
    

`{  "sensor_id":  "HVAC_01",  "temperature":  72.4,  "status":  "NORMAL"  }` 

4.  Frontend updates UI components
    
5.  Repeat → You get a live digital-twin experience
    

----------

# **5. DevOps Architecture**

## **5.1 Docker**

Each piece runs in its own container:

-   **Backend container:** FastAPI + simulator
    
-   **Frontend container:** React dev server/build
    

`docker-compose.yml` ties them together.

## **5.2 GitHub Actions CI**

Triggered on:

-   Push
    
-   Pull Request
    

Tasks:

1.  Install Python
    
2.  Install requirements
    
3.  Lint/validate
    
4.  Build Docker image
    

This proves engineering discipline and production readiness.

----------

# **6. Local Development**

### Backend:

`cd backend
uvicorn app.main:app --reload` 

### Frontend:

`cd frontend
npm install
npm run dev` 

### With Docker:

`docker-compose up --build` 

----------

# **7. Scaling Vision**

Future upgrades for The Whispering Walls:

-   Multiple sensors across floors
    
-   WebSockets for real-time streaming
    
-   MQTT for IoT flavor
    
-   Predictive analytics
    
-   3D building model with hotspots
    
-   Database for historical “whispers”
    

----------

# **8. Why This Architecture Works**

-   Easy for a two-person team
    
-   Clean separation of responsibilities
    
-   Designed to scale in features and size
    
-   Matches AEC/O “Operate” phase thinking
    
-   Perfect talking point for interviews