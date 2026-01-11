import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from contextlib import asynccontextmanager # <--- This was missing!

# Internal imports
from app.config import settings
from app.routes import payment_routes
from app.database.models.payment_model import Payment

# 1. Setup the Lifespan (Startup/Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB Atlas using the .env URL
    client = AsyncIOMotorClient(settings.MONGO_URL)
    
    # Initialize Beanie with our Payment model
    # get_default_database() automatically picks 'payment' from your URL string
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include the Routes
app.include_router(payment_routes.router, prefix="/api/v1/payments")

@app.get("/")
async def health_check():
    return {
        "status": "Payment Service is running",
        "database": "Connected to Atlas"
    }

# 5. Start the server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4004, reload=True)