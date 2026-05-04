from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import JWTError, jwt
from typing import List
import numpy as np
import joblib
import os

# ========================= CONFIGURATION =========================
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

app = FastAPI(title="Fraud Guard API")

# ========================= CORS =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://creditcardfraud-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================= SECURITY =========================
security = HTTPBearer()

def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            audience="authenticated"
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID found"
            )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )

# ========================= PYDANTIC SCHEMAS =========================
class TransactionInput(BaseModel):
    features: List[float]

# ========================= MODEL LOADING =========================
try:
    model_path = os.path.join(os.path.dirname(__file__), "fraud_model.pkl")
    model_data = joblib.load(model_path)
    w = model_data['w']
    b = model_data['b']
    mu = model_data['mu']
    sigma = model_data['sigma']
    eps = 1e-15
    print("✅ Fraud model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", e)
    raise

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

# ========================= ROUTES =========================
@app.get("/")
async def root():
    return {"message": "Fraud Guard API is running", "status": "ok", "version": "1.0"}

@app.post("predict-debug")
async def predict_debug(request: Request):
    auth = request.headers.get("Authorization", "No auth header")
    secret = os.getenv("SUPABASE_JWT_SECRET", "NOT SET")
    return {
        "auth_header_present": auth != "No auth header",
        "auth_preview": auth[:40] if len(auth) > 40 else auth,
        "secret_set": secret != "NOT SET",
        "secret_length": len(secret) if secret != "NOT SET" else 0
    }

@app.post("/predict")
async def predict_fraud(
    data: TransactionInput,
    user: dict = Depends(verify_supabase_token)
):
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
            "recommendation": "Block transaction" if is_fraud else "Allow transaction",
            "user_id": user.get("sub")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
