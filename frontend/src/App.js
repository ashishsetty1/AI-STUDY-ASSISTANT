import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = 
process.env.REACT_APP_API_BASE_URL || "https://ai-study-assistant-qy3m.onrender.com";

function App() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE}/documents/files`);
      setUploadedFiles(response.data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please choose at least one PDF file first.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage("Uploading and indexing PDFs...");

      const uploadedNames = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${API_BASE}/documents/upload-pdf`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );

        uploadedNames.push(response.data.filename);
      }

      setUploadMessage(
        `Upload complete — ${uploadedNames.join(", ")} ${uploadedNames.length > 1 ? "have" : "has"} been indexed successfully.`
      );
      setFiles([]);
      await fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);

      if (error.response?.data?.detail) {
        setUploadMessage(`Upload failed: ${error.response.data.detail}`);
      } else {
        setUploadMessage("Upload failed. Please check the backend connection.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    const currentQuestion = question;
    setQuestion("");

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE}/documents/ask`, {
        question: currentQuestion
      });

      const newEntry = {
        question: currentQuestion,
        answer: response.data.answer,
        sources: response.data.sources || []
      };

      setChatHistory((prev) => [...prev, newEntry]);
    } catch (error) {
      console.error(error);

      const newEntry = {
        question: currentQuestion,
        answer: "Something went wrong while generating the answer.",
        sources: []
      };

      setChatHistory((prev) => [...prev, newEntry]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, #1e293b 0%, #0f172a 35%, #020617 100%)",
      color: "#e2e8f0",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: "32px"
    },
    shell: {
      maxWidth: "1280px",
      margin: "0 auto"
    },
    hero: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "24px",
      marginBottom: "28px",
      flexWrap: "wrap"
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(59, 130, 246, 0.12)",
      color: "#93c5fd",
      border: "1px solid rgba(96, 165, 250, 0.25)",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "13px",
      fontWeight: 600,
      marginBottom: "16px"
    },
    title: {
      fontSize: "48px",
      lineHeight: 1.05,
      fontWeight: 800,
      margin: 0,
      letterSpacing: "-0.03em",
      color: "#f8fafc"
    },
    subtitle: {
      marginTop: "14px",
      maxWidth: "760px",
      color: "#94a3b8",
      fontSize: "18px",
      lineHeight: 1.6
    },
    heroCard: {
      minWidth: "280px",
      background: "linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.85))",
      border: "1px solid rgba(148,163,184,0.14)",
      borderRadius: "24px",
      padding: "22px",
      boxShadow: "0 20px 50px rgba(2, 6, 23, 0.35)"
    },
    heroStatLabel: {
      color: "#94a3b8",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.08em"
    },
    heroStatValue: {
      color: "#f8fafc",
      fontSize: "34px",
      fontWeight: 800,
      marginTop: "8px"
    },
    heroStatSub: {
      color: "#cbd5e1",
      fontSize: "14px",
      marginTop: "10px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gap: "24px",
      alignItems: "start"
    },
    sidebarCard: {
      background: "rgba(15, 23, 42, 0.72)",
      border: "1px solid rgba(148,163,184,0.14)",
      borderRadius: "24px",
      padding: "22px",
      boxShadow: "0 18px 45px rgba(2, 6, 23, 0.28)",
      backdropFilter: "blur(8px)",
      position: "sticky",
      top: "24px"
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: 700,
      color: "#f8fafc"
    },
    sectionSubtitle: {
      marginTop: "8px",
      marginBottom: "18px",
      color: "#94a3b8",
      fontSize: "14px",
      lineHeight: 1.6
    },
    fileList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    fileItem: {
      background: "rgba(30, 41, 59, 0.9)",
      border: "1px solid rgba(148,163,184,0.12)",
      color: "#e2e8f0",
      borderRadius: "16px",
      padding: "14px 14px",
      fontSize: "14px",
      lineHeight: 1.4,
      wordBreak: "break-word"
    },
    emptyState: {
      padding: "18px",
      borderRadius: "16px",
      background: "rgba(30, 41, 59, 0.65)",
      border: "1px dashed rgba(148,163,184,0.18)",
      color: "#94a3b8",
      fontSize: "14px"
    },
    contentStack: {
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    },
    card: {
      background: "rgba(15, 23, 42, 0.72)",
      border: "1px solid rgba(148,163,184,0.14)",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 18px 45px rgba(2, 6, 23, 0.28)",
      backdropFilter: "blur(8px)"
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "18px"
    },
    cardTitle: {
      margin: 0,
      fontSize: "24px",
      fontWeight: 700,
      color: "#f8fafc"
    },
    cardDescription: {
      marginTop: "6px",
      color: "#94a3b8",
      fontSize: "14px"
    },
    uploadArea: {
      border: "1.5px dashed rgba(96,165,250,0.35)",
      borderRadius: "20px",
      padding: "24px",
      background: "linear-gradient(180deg, rgba(30,41,59,0.45), rgba(15,23,42,0.2))"
    },
    inputRow: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      flexWrap: "wrap"
    },
    fileInput: {
      color: "#cbd5e1",
      fontSize: "14px"
    },
    primaryButton: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "#ffffff",
      border: "none",
      borderRadius: "14px",
      padding: "12px 18px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 12px 24px rgba(37, 99, 235, 0.28)"
    },
    secondaryButton: {
      background: "rgba(30, 41, 59, 0.95)",
      color: "#e2e8f0",
      border: "1px solid rgba(148,163,184,0.18)",
      borderRadius: "14px",
      padding: "12px 18px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer"
    },
    disabledButton: {
      opacity: 0.65,
      cursor: "not-allowed"
    },
    selectedFilesWrap: {
      marginTop: "18px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px"
    },
    fileChip: {
      background: "rgba(59, 130, 246, 0.16)",
      color: "#bfdbfe",
      border: "1px solid rgba(96,165,250,0.22)",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: 600
    },
    message: {
      marginTop: "18px",
      padding: "14px 16px",
      borderRadius: "14px",
      background: "rgba(16, 185, 129, 0.12)",
      border: "1px solid rgba(16, 185, 129, 0.22)",
      color: "#a7f3d0",
      fontSize: "14px"
    },
    textarea: {
      width: "100%",
      minHeight: "130px",
      resize: "vertical",
      borderRadius: "18px",
      border: "1px solid rgba(148,163,184,0.18)",
      background: "rgba(2, 6, 23, 0.55)",
      color: "#f8fafc",
      padding: "16px 18px",
      fontSize: "15px",
      lineHeight: 1.6,
      outline: "none",
      boxSizing: "border-box"
    },
    actionRow: {
      display: "flex",
      gap: "12px",
      marginTop: "14px",
      flexWrap: "wrap"
    },
    loadingText: {
      marginTop: "12px",
      color: "#93c5fd",
      fontWeight: 600,
      fontSize: "14px"
    },
    chatStack: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginTop: "18px"
    },
    chatCard: {
      background: "linear-gradient(180deg, rgba(30,41,59,0.92), rgba(15,23,42,0.92))",
      border: "1px solid rgba(148,163,184,0.12)",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 12px 28px rgba(2, 6, 23, 0.18)"
    },
    label: {
      color: "#93c5fd",
      fontWeight: 700,
      marginRight: "6px"
    },
    questionText: {
      color: "#f8fafc",
      fontSize: "15px",
      lineHeight: 1.6
    },
    answerText: {
      color: "#dbeafe",
      fontSize: "15px",
      lineHeight: 1.7,
      marginTop: "10px"
    },
    sourceWrap: {
      marginTop: "16px"
    },
    sourceTitle: {
      color: "#cbd5e1",
      fontWeight: 700,
      marginBottom: "10px"
    },
    sourceList: {
      margin: 0,
      paddingLeft: "20px",
      color: "#93c5fd"
    },
    emptyChat: {
      padding: "24px",
      borderRadius: "18px",
      background: "rgba(30, 41, 59, 0.6)",
      border: "1px dashed rgba(148,163,184,0.18)",
      color: "#94a3b8"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <div>
            <div style={styles.badge}>AI Document Q&A Platform</div>
            <h1 style={styles.title}>AI Study Assistant</h1>
            <p style={styles.subtitle}>
              Upload lecture PDFs, index them instantly, and ask questions across
              multiple documents with cited sources and AI-generated answers.
            </p>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.heroStatLabel}>Indexed documents</div>
            <div style={styles.heroStatValue}>{uploadedFiles.length}</div>
            <div style={styles.heroStatSub}>
              Multi-document semantic search powered by embeddings and vector retrieval.
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <aside style={styles.sidebarCard}>
            <h2 style={styles.sectionTitle}>Uploaded PDFs</h2>
            <p style={styles.sectionSubtitle}>
              All indexed documents currently available for question answering.
            </p>

            {uploadedFiles.length === 0 ? (
              <div style={styles.emptyState}>
                No files uploaded yet. Add one or more PDFs to get started.
              </div>
            ) : (
              <ul style={styles.fileList}>
                {uploadedFiles.map((pdf, index) => (
                  <li key={index} style={styles.fileItem}>
                    {pdf}
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <main style={styles.contentStack}>
            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Upload Documents</h2>
                  <div style={styles.cardDescription}>
                    Add one or more PDF files and index them for semantic retrieval.
                  </div>
                </div>
              </div>

              <div style={styles.uploadArea}>
                <div style={styles.inputRow}>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    style={styles.fileInput}
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{
                      ...styles.primaryButton,
                      ...(uploading ? styles.disabledButton : {})
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload PDFs"}
                  </button>
                </div>

                {files.length > 0 && (
                  <div style={styles.selectedFilesWrap}>
                    {files.map((file, index) => (
                      <div key={index} style={styles.fileChip}>
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}

                {uploadMessage && <div style={styles.message}>{uploadMessage}</div>}
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Ask Questions</h2>
                  <div style={styles.cardDescription}>
                    Query your indexed documents and get contextual AI answers with sources.
                  </div>
                </div>
              </div>

              <textarea
                rows="4"
                style={styles.textarea}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="Ask something about your uploaded PDFs..."
              />

              <div style={styles.actionRow}>
                <button
                  onClick={handleAsk}
                  disabled={loading}
                  style={{
                    ...styles.primaryButton,
                    ...(loading ? styles.disabledButton : {})
                  }}
                >
                  {loading ? "Thinking..." : "Ask Question"}
                </button>

                <button
                  onClick={() => setChatHistory([])}
                  style={styles.secondaryButton}
                >
                  Clear Chat
                </button>
              </div>

              {loading && <div style={styles.loadingText}>Generating answer...</div>}
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Conversation</h2>
                  <div style={styles.cardDescription}>
                    Your question history and generated responses appear here.
                  </div>
                </div>
              </div>

              {chatHistory.length === 0 ? (
                <div style={styles.emptyChat}>
                  No questions yet. Upload PDFs and start asking.
                </div>
              ) : (
                <div style={styles.chatStack}>
                  {chatHistory.map((entry, index) => (
                    <div key={index} style={styles.chatCard}>
                      <div style={styles.questionText}>
                        <span style={styles.label}>You:</span>
                        {entry.question}
                      </div>

                      <div style={styles.answerText}>
                        <span style={styles.label}>AI:</span>
                        {entry.answer}
                      </div>

                      {entry.sources.length > 0 && (
                        <div style={styles.sourceWrap}>
                          <div style={styles.sourceTitle}>Sources</div>
                          <ul style={styles.sourceList}>
                            {entry.sources.map((source, i) => (
                              <li key={i}>{source}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;