from fastapi import FastAPI
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAGFusion API Documentation")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def home():
    return {"message": "🚀 FastAPI is running!"}

# Include additional routes
app.include_router(router)