from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os

app = FastAPI(title="AI HealthOS Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SymptomData(BaseModel):
    symptoms: List[str]
    age: Optional[int] = None
    gender: Optional[str] = None

class DrugInteractionData(BaseModel):
    drugs: List[str]

class HealthPredictionData(BaseModel):
    features: Dict[str, float]

# API Key Validation
API_KEY = os.getenv("API_KEY", "ai-service-secret-key")

def validate_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

# Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AI HealthOS"}

# Symptom Checker
@app.post("/api/v1/symptom-checker")
def check_symptoms(data: SymptomData, api_key: str = None):
    validate_api_key(api_key)
    
    # Mock implementation - Replace with actual AI model
    conditions = []
    
    symptom_map = {
        "fever": ["Malaria", "Typhoid", "Flu"],
        "headache": ["Migraine", "Tension Headache", "Eye Strain"],
        "cough": ["Common Cold", "Bronchitis", "Pneumonia"],
        "fatigue": ["Anemia", "Diabetes", "Thyroid"],
    }
    
    for symptom in data.symptoms:
        if symptom.lower() in symptom_map:
            conditions.extend(symptom_map[symptom.lower()])
    
    if not conditions:
        conditions = ["General Consultation Recommended"]
    
    return {
        "possible_conditions": list(set(conditions)),
        "recommendation": "Please consult a doctor for proper diagnosis",
        "confidence": 0.75
    }

# Drug Interaction Checker
@app.post("/api/v1/drug-interaction")
def check_drug_interaction(data: DrugInteractionData, api_key: str = None):
    validate_api_key(api_key)
    
    # Mock implementation - Replace with actual drug database
    interactions = {
        ("aspirin", "warfarin"): {
            "severity": "high",
            "description": "Increased risk of bleeding"
        },
        ("ibuprofen", "aspirin"): {
            "severity": "moderate",
            "description": "May reduce aspirin effectiveness"
        }
    }
    
    found_interactions = []
    for i in range(len(data.drugs)):
        for j in range(i + 1, len(data.drugs)):
            drug1, drug2 = data.drugs[i].lower(), data.drugs[j].lower()
            key = tuple(sorted([drug1, drug2]))
            if key in interactions:
                found_interactions.append({
                    "drugs": list(key),
                    **interactions[key]
                })
    
    return {
        "interactions": found_interactions,
        "total_found": len(found_interactions)
    }

# Health Prediction
@app.post("/api/v1/predict")
def predict_health(data: HealthPredictionData, api_key: str = None):
    validate_api_key(api_key)
    
    # Mock implementation - Replace with ML model
    prediction = "Normal"
    confidence = 0.85
    
    return {
        "prediction": prediction,
        "confidence": confidence,
        "recommendations": [
            "Maintain healthy lifestyle",
            "Regular exercise",
            "Balanced diet"
        ]
    }

# Generic Medicine Finder
@app.get("/api/v1/generic-medicine/{brand_name}")
def find_generic_medicine(brand_name: str, api_key: str = None):
    validate_api_key(api_key)
    
    # Mock database
    generic_map = {
        "tylenol": "Acetaminophen/Paracetamol",
        "advil": "Ibuprofen",
        "aspirin": "Acetylsalicylic Acid",
    }
    
    generic = generic_map.get(brand_name.lower())
    
    if generic:
        return {
            "brand_name": brand_name,
            "generic_name": generic,
            "savings_estimate": "40-60%"
        }
    
    return {
        "brand_name": brand_name,
        "generic_name": "Not found in database",
        "savings_estimate": "N/A"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
