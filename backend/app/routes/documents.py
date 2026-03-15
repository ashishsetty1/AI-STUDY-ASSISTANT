import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf
from app.services.vector_service import (
    store_document_chunks,
    search_similar_chunks,
    get_all_filenames,
)
from app.services.openai_service import answer_question

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class QuestionRequest(BaseModel):
    question: str


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = extract_text_from_pdf(file_path)

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

    store_document_chunks(extracted_text, file.filename)

    return {
        "message": "PDF uploaded and indexed successfully.",
        "filename": file.filename,
        "text_preview": extracted_text[:1000]
    }


@router.post("/ask")
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    search_results = search_similar_chunks(request.question)

    relevant_chunks = search_results["chunks"]
    sources = search_results["sources"]

    if not relevant_chunks:
        raise HTTPException(status_code=400, detail="No indexed documents found yet.")

    answer = answer_question(request.question, relevant_chunks)

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources,
        "matched_chunks": relevant_chunks
    }


@router.get("/files")
def get_uploaded_files():
    return {"files": get_all_filenames()}