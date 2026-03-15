from fastapi import APIRouter, HTTPException
from app.models.schemas import SummaryRequest, SummaryResponse
from app.services.openai_service import summarize_text

router = APIRouter()


@router.post("/summarize", response_model=SummaryResponse)
def summarize(request: SummaryRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    summary = summarize_text(request.text)
    return SummaryResponse(summary=summary)