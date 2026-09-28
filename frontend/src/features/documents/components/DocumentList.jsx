import React from "react";
import { DocumentCard } from "./DocumentCard.jsx";
import { Database, Trash2, FolderOpen } from "lucide-react";

export function DocumentList({
  documents,
  onDeleteDoc,
  onClearAll,
  isLoading,
}) {
  const totalChunks = documents.reduce(
    (acc, doc) => acc + (doc.chunkCount || 0),
    0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          <Database size={14} color="#6366f1" />
          <span>Indexed Sources ({documents.length})</span>
        </div>
        {documents.length > 0 && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear all indexed documents from the vector database?",
                )
              ) {
                onClearAll();
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.72rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            title="Clear all documents"
          >
            <Trash2 size={12} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {documents.length === 0 ? (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <FolderOpen
              size={24}
              style={{ color: "var(--text-muted)", margin: "0 auto 8px" }}
            />
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              No documents indexed yet.
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              Upload files above or seed sample docs to start.
            </div>
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDelete={onDeleteDoc} />
          ))
        )}
      </div>

      {documents.length > 0 && (
        <div
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          Total Vector Chunks:{" "}
          <strong style={{ color: "#c7d2fe" }}>{totalChunks}</strong>
        </div>
      )}
    </div>
  );
}
