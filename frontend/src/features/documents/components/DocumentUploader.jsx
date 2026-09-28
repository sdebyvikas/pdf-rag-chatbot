import React, { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function DocumentUploader({ onUpload, isUploading, uploadError }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    try {
      setUploadSuccess(false);
      await onUpload(files);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        className={`upload-zone ${isDragOver ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.markdown,.csv,.json"
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <div className="upload-icon">
          {isUploading ? (
            <Loader2 size={22} className="spin" />
          ) : (
            <UploadCloud size={22} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {isUploading ? "Chunking & Embedding..." : "Upload Knowledge Docs"}
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Drag & drop or click to browse (PDF, DOCX, TXT, MD, CSV)
          </span>
        </div>
      </div>

      {uploadSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: "#6ee7b7",
            background: "rgba(16, 185, 129, 0.1)",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <CheckCircle2 size={14} />
          <span>Documents ingested and vectorized into knowledge base!</span>
        </div>
      )}

      {uploadError && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: "#fca5a5",
            background: "rgba(239, 68, 68, 0.1)",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
