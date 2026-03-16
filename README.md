AI Study Assistant

AI Study Assistant is a full-stack application that allows students to upload study materials and ask questions about them using AI-powered retrieval and vector search. The system converts documents into embeddings, stores them in a vector database, and retrieves relevant context to generate answers.

The goal of this project is to help students quickly find information in their notes, textbooks, and lecture materials without manually searching through large documents.

Features

Upload lecture notes and study materials

AI-powered question answering

Semantic search using vector embeddings

Retrieval Augmented Generation (RAG)

Fast API responses using FastAPI backend

Modern React frontend interface

Vector database for efficient document retrieval

Tech Stack

Frontend

React

JavaScript

Axios

Backend

FastAPI

Python

Uvicorn

AI / Data

OpenAI Embeddings

ChromaDB (Vector Database)

Retrieval Augmented Generation (RAG)

Development Tools

Git

GitHub

Render (optional deployment)

System Architecture

The system follows a RAG (Retrieval Augmented Generation) pipeline.

User uploads documents which are converted into embeddings and stored in a vector database. When the user asks a question, the system retrieves relevant document chunks and sends them to the LLM to generate an answer.

User
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
Embedding Model
   ↓
Vector Database (ChromaDB)
   ↓
Relevant Context Retrieved
   ↓
LLM Generates Answer
Project Structure
ai-study-assistant
│
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── routes
│   │   └── services
│   └── chroma_db
│
├── frontend
│   ├── src
│   ├── components
│   └── pages
│
├── screenshots
│
└── README.md
Screenshots

## Upload Interface
![Upload Page](screenshots/upload.png)

## AI Chat Interface
![Chat Interface](screenshots/chat.png)

1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/ai-study-assistant.git
cd ai-study-assistant
Backend Setup

Navigate to the backend folder.

cd backend

Install dependencies.

pip install -r requirements.txt

Run the FastAPI server.

uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs
Frontend Setup

Navigate to the frontend folder.

cd frontend

Install dependencies.

npm install

Run the React development server.

npm start

Frontend will run at:

http://localhost:3000
Environment Variables

Create a .env file in the backend directory.

Example:

OPENAI_API_KEY=your_api_key_here
Future Improvements

User authentication

Document upload support for PDFs and lecture slides

Chat history storage

Improved UI for document management

Deployment using Docker

Real-time streaming responses

Multi-document knowledge base

Learning Outcomes

This project demonstrates experience with:

Full-stack web development

REST API design

Vector databases

AI integration with LLMs

Retrieval Augmented Generation

Building scalable backend services

Author

Ashish Setty
Full Stack Developer
