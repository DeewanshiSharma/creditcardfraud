from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from typing import List

app = FastAPI(title="Fraud Guard API")

# ✅ FIXED CORS - Remove empty strings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load model
try:
    model_data = joblib.load("fraud_model.pkl")
    w = model_data['w']
    b = model_data['b']
    mu = model_data['mu']
    sigma = model_data['sigma']
    eps = 1e-15
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", e)
    raise

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))  # ✅ Prevent overflow

class TransactionInput(BaseModel):
    features: List[float]

@app.post("/predict")
async def predict_fraud(data: TransactionInput):
    try:
        if len(data.features) != 30:
            raise HTTPException(status_code=400, detail="Exactly 30 features required")
        
        x = np.array(data.features, dtype=np.float64).reshape(1, -1)
        x_scaled = (x - mu) / (sigma + eps)
        z = x_scaled @ w + b
        prob = float(sigmoid(z)[0])
        
        threshold = 0.90
        is_fraud = prob >= threshold
        
        return {
            "is_fraud": bool(is_fraud),
            "fraud_probability": round(prob * 100, 2),
            "threshold_used": threshold,
            "message": "🚨 High Risk - Possible Fraud!" if is_fraud else "✅ Transaction appears legitimate.",
            "recommendation": "Block transaction" if is_fraud else "Allow transaction"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Fraud Guard API is running", "model": "Custom Logistic Regression"}