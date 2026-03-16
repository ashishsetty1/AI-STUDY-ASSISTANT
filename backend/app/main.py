from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.ai import router as ai_router
from app.routes.documents import router as documents_router

app = FastAPI(title="AI Study Assistant")

origins = [
    "http://localhost:3000",
    "https://ai-study-assistant.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(documents_router, prefix="/documents", tags=["Documents"])


@app.get("/")
def root():
    return {"status": "ok"}