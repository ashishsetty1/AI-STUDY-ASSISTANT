import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def summarize_text(text: str) -> str:
    truncated_text = text[:4000]

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful study assistant. Summarize notes clearly and accurately."
            },
            {
                "role": "user",
                "content": f"Summarize these study notes:\n\n{truncated_text}"
            }
        ]
    )

    return response.choices[0].message.content or "No summary returned."


def answer_question(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful study assistant. Answer the question using only the provided context. "
                    "If the answer is not in the context, say that the answer was not found in the uploaded PDF."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}"
            }
        ]
    )

    return response.choices[0].message.content or "No answer returned."