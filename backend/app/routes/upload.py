import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = extract_text_from_pdf(file_path)

    return {
        "filename": file.filename,
        "extracted_text": extracted_text[:3000]
    }