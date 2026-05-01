from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
import numpy as np
import joblib
import os

# ========================= CONFIGURATION =========================
SECRET_KEY = "change-this-to-a-very-strong-secret-key-2026"  # ← Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60   # 24 hours

# Database - Better path for Render
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/users.db"   # Changed to /data folder

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI(title="Fraud Guard API")

# ========================= CORS - FIXED =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://creditcardfraud-1.onrender.com",     # Your Frontend
        "https://creditcardfraud-tyza.onrender.com",  # Your Backend
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "*"                                            # ← Remove this after testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ========================= DATABASE MODEL =========================
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# ========================= PYDANTIC SCHEMAS =========================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TransactionInput(BaseModel):
    features: List[float]

# ========================= HELPERS =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# ========================= MODEL LOADING =========================
try:
    model_data = joblib.load("fraud_model.pkl")
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
@app.post("/register", status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if username or email already exists
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(status_code=400, detail="Username already registered")
        
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(user.password)
        
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        print(f"✅ New user registered: {user.username}")  # For Render Logs
        return {"message": "Account created successfully! You can now login."}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Register Error: {str(e)}")   # This will appear in Render Logs
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/predict")
async def predict_fraud(
    data: TransactionInput,
    current_user: User = Depends(get_current_user)
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
            "logged_in_user": current_user.username
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Fraud Guard API is running", "status": "ok"}
