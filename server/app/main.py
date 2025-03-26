from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="RAGFusion API Documentation")

@app.get("/")
def home():
    return {"message": "🚀 FastAPI is running!"}

# Include additional routes
app.include_router(router)