import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from contextlib import asynccontextmanager

# Internal imports
from app.config import settings
from app.routes import payment_routes
from app.database.models.payment_model import Payment

# 1. Setup the Lifespan (Startup/Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB Atlas using Settings
    # settings.MONGO_URL is read from your .env
    client = AsyncIOMotorClient(settings.MONGO_URL)
    
    # Initialize Beanie with our Payment model
    await init_beanie(
        database=client.get_default_database(), 
        document_models=[Payment]
    )
    print("🚀 Connected to MongoDB Atlas and initialized Beanie")
    
    yield  # The application runs here
    
    # Shutdown: Close the connection
    client.close()
    print("🛑 MongoDB connection closed")

# 2. Initialize the FastAPI app
app = FastAPI(
    title="Bakong Payment Microservice",
    lifespan=lifespan
)

# 3. Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://e-commerce-testing-tan.vercel.app",
        "https://e-smart-shop.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include the Routes
# This matches your Gateway's expected path
app.include_router(payment_routes.router, prefix="/api/v1/payments")

# --- HEALTH CHECK FOR CRON-JOB ---
@app.get("/health")
async def health_check():
    return "ok"

@app.get("/")
async def root():
    return {"message": "Payment Service is Online"}

# 5. Start the server
if __name__ == "__main__":
    # Settings.port is now valid because we added it to config.py
    # This will use the $PORT from Render in production automatically
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)