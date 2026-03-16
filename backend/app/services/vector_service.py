from sentence_transformers import SentenceTransformer
import chromadb

_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


chroma_client = chromadb.PersistentClient(path="chroma_db")
collection = chroma_client.get_or_create_collection(name="study_documents")


def chunk_text(text: str, chunk_size: int = 500):
    chunks = []
    start = 0

    while start < len(text):
        chunk = text[start:start + chunk_size]
        chunks.append(chunk)
        start += chunk_size

    return chunks


def store_document_chunks(text: str, filename: str):
    chunks = chunk_text(text)

    if not chunks:
        return

    model = get_model()
    embeddings = model.encode(chunks).tolist()
    ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"filename": filename} for _ in chunks]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )


def search_similar_chunks(query: str, top_k: int = 3):
    model = get_model()
    query_embedding = model.encode([query]).tolist()[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    if not documents:
        return {"chunks": [], "sources": []}

    sources = []
    for metadata in metadatas:
        if metadata and "filename" in metadata:
            sources.append(metadata["filename"])

    unique_sources = list(dict.fromkeys(sources))

    return {
        "chunks": documents,
        "sources": unique_sources
    }


def get_all_filenames():
    results = collection.get()
    metadatas = results.get("metadatas", [])

    filenames = []
    for metadata in metadatas:
        if metadata and "filename" in metadata:
            filenames.append(metadata["filename"])

    return list(dict.fromkeys(filenames))